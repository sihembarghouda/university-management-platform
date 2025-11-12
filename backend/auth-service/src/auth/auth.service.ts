import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Utilisateur } from 'src/utilisateur/utilisateur.entity/utilisateur.entity';
import { randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { generateEmailVerificationLink, generatePasswordResetLink, ensureFirebaseUser, updateFirebasePassword } from 'src/firebase/firebase.service';
import * as fs from 'fs';
import * as path from 'path';
import { validatePassword } from './password-validator';


const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur) private readonly usersRepo: Repository<Utilisateur>,
    private readonly jwt: JwtService,
    private readonly mailerService: MailerService
  ) {}

  private async hash(s: string) {
    return bcrypt.hash(s, BCRYPT_ROUNDS);
  }
  private async compare(s: string, h: string) {
    return bcrypt.compare(s, h);
  }

  async login(email: string, password: string) {
    console.log('🔑 [Login] Attempt for email:', email);
    
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      console.log('❌ [Login] User not found');
      throw new UnauthorizedException('Identifiants invalides');
    }

    console.log('✅ [Login] User found:', user.email);
    console.log('🔐 [Login] Stored hash:', user.mdp_hash.substring(0, 20) + '...');

    if (!user.emailConfirmed) {
      console.log('❌ [Login] Email not confirmed');
      throw new ForbiddenException('Email non confirmé');
    }

    console.log('🔐 [Login] Comparing password...');
    const ok = await this.compare(password, user.mdp_hash);
    console.log('🔐 [Login] Password match:', ok);
    
    if (!ok) {
      console.log('❌ [Login] Password mismatch');
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (user.doit_changer_mdp) {
      console.log('⚠️ [Login] Password change required');
      throw new ForbiddenException('Changement de mot de passe requis');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
    };
    const access_token = await this.jwt.signAsync(payload);

    console.log('✅ [Login] Success!');
    return {
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
      },
      token: access_token,
    };
  }

  async changePassword(email: string, currentPassword: string, newPassword: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    const ok = await this.compare(currentPassword, user.mdp_hash);
    if (!ok) throw new UnauthorizedException('Mot de passe actuel incorrect');

    // Valider le nouveau mot de passe
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    user.mdp_hash = await this.hash(newPassword);
    user.doit_changer_mdp = false;

    await this.usersRepo.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
    };
    const access_token = await this.jwt.signAsync(payload);

    return {
      success: true,
      message: 'Mot de passe mis à jour',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
      },
      token: access_token,
    };
  }

  // Utilitaire pour import initial: mdp = hash(CIN) + forcer changement
  async setInitialPasswordFromCIN(userId: number, cin: string) {
    const mdpHash = await this.hash(cin);
    await this.usersRepo.update(userId, { mdp_hash: mdpHash, doit_changer_mdp: true });
  }
  
  async confirmEmail(email: string, token: string) {
    const user = await this.usersRepo.findOne({ where: { email, confirmationToken: token } });
    if (!user) throw new BadRequestException('Token invalide ou email incorrect');

    user.emailConfirmed = true;
    user.confirmationToken = null;
    console.log('Updating user:', user);
    await this.usersRepo.save(user);

    return { message: 'Email confirmé avec succès' };
  }


  async resendConfirmation(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Utilisateur introuvable');

    if (user.emailConfirmed) {
      throw new BadRequestException('Email déjà confirmé');
    }

    const token = randomBytes(32).toString('hex');
    user.confirmationToken = token;
    await this.usersRepo.save(user);
    // Ensure user exists in Firebase Auth and generate verification link
    // await ensureFirebaseUser(email, user.cin ?? 'TempPass123!');
    const continueUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/confirm-email?email=${encodeURIComponent(email)}&token=${token}`;
    const link = continueUrl; // await generateEmailVerificationLink(email, continueUrl);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirmation de votre email',
      text: `Cliquez ici pour confirmer votre email : ${link}`,
      html: `<p>Bonjour ${user.prenom || user.email},</p><p>Cliquez sur le lien suivant pour confirmer votre email:</p><p><a href="${link}">Confirmer mon email</a></p>`,
    });

    // TODO: Send email with confirmation link
    // Example: http://localhost:3000/auth/confirm-email?email=...&token=...

    return { message: 'Lien de confirmation renvoyé' };
  }
   
  async forgotPassword(email: string) {
    console.log('🔍 [ForgotPassword] Started for email:', email);
    
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      console.log('⚠️ [ForgotPassword] User not found for email:', email);
      // Don't reveal if user exists for security
      return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
    }

    console.log('✅ [ForgotPassword] User found:', user.email);

    try {
      // Generate our own reset token (not Firebase)
      const token = randomBytes(32).toString('hex');
      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 1); // Token expires in 1 hour

      user.resetToken = token;
      user.resetTokenExpires = expiresIn;
      await this.usersRepo.save(user);
      console.log('💾 [ForgotPassword] Token saved to database');

      // Create direct link to OUR reset password page with OUR token
      const resetUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3003'}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
      console.log('🔗 [ForgotPassword] Reset URL:', resetUrl);
      
      // Send email with OUR link (not Firebase)
      console.log('📧 [ForgotPassword] Sending email...');
      
      await this.mailerService.sendMail({
        to: email,
        subject: '🔐 Réinitialisation de votre mot de passe - ISETT',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { text-align: center; color: #667eea; margin-bottom: 30px; }
              .button { display: inline-block; padding: 15px 30px; background-color: #667eea; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Réinitialisation de mot de passe</h1>
              </div>
              <p>Bonjour <strong>${user.prenom || user.nom}</strong>,</p>
              <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte ISETT.</p>
              <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              </div>
              <p><strong>⏱️ Ce lien est valable pendant 1 heure.</strong></p>
              <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <p style="color: #e53e3e; margin-top: 20px;">⚠️ <strong>Vous n'avez pas demandé cette réinitialisation ?</strong><br>Ignorez simplement cet email. Votre mot de passe reste sécurisé.</p>
              <div class="footer">
                <p><strong>Équipe ISETT</strong></p>
                <p>© ${new Date().getFullYear()} ISETT. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      
      console.log('✅ [ForgotPassword] Email sent successfully!');
    } catch (error) {
      console.error('❌ [ForgotPassword] Error:', error);
      throw error;
    }

    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    console.log('🔐 [ResetPassword] Started for email:', email);
    console.log('🔐 [ResetPassword] Token received:', token);
    console.log('🔐 [ResetPassword] Token length:', token?.length);
    
    const user = await this.usersRepo.findOne({ where: { email, resetToken: token } });
    
    if (!user) {
      console.log('❌ [ResetPassword] User not found or token mismatch');
      // Try to find user by email only to check if token matches
      const userByEmail = await this.usersRepo.findOne({ where: { email } });
      if (userByEmail) {
        console.log('🔍 [ResetPassword] User exists but token mismatch');
        console.log('🔍 [ResetPassword] Stored token:', userByEmail.resetToken);
        console.log('🔍 [ResetPassword] Token expires:', userByEmail.resetTokenExpires);
        console.log('🔍 [ResetPassword] Current time:', new Date());
      } else {
        console.log('🔍 [ResetPassword] User with this email does not exist');
      }
      throw new BadRequestException('Token invalide ou expiré');
    }

    console.log('✅ [ResetPassword] User found:', user.email);
    console.log('🔐 [ResetPassword] Token expires:', user.resetTokenExpires);

    if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      console.log('❌ [ResetPassword] Token expired');
      throw new BadRequestException('Le token a expiré');
    }

    // Valider le nouveau mot de passe
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      console.log('❌ [ResetPassword] Password validation failed:', validation.errors);
      throw new BadRequestException(validation.errors.join(', '));
    }

    console.log('🔐 [ResetPassword] Hashing new password...');
    const newHash = await this.hash(newPassword);
    console.log('🔐 [ResetPassword] New hash generated:', newHash.substring(0, 20) + '...');
    
    user.mdp_hash = newHash;
    user.resetToken = null as any;
    user.resetTokenExpires = null as any;
    user.doit_changer_mdp = false;
    
    await this.usersRepo.save(user);
    console.log('✅ [ResetPassword] Password saved to database');

    // Update password in Firebase as well
    // try {
    //   await updateFirebasePassword(email, newPassword);
    //   console.log('✅ [ResetPassword] Firebase password updated');
    // } catch (err) {
    //   // Log and continue; DB password is authoritative
    //   console.warn('⚠️ [ResetPassword] Failed to update firebase password', err);
    // }

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
