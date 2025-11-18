import * as admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin SDK
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
  path.join(__dirname, '../../isett-497f3-firebase-adminsdk-fbsvc-cc94a3ba88.json');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      projectId: process.env.FIREBASE_PROJECT_ID || 'isett-497f3',
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
  }
}

/**
 * Ensure a user exists in Firebase Auth
 * Creates the user if they don't exist
 */
export async function ensureFirebaseUser(email: string, password: string): Promise<void> {
  try {
    // Check if user exists
    await admin.auth().getUserByEmail(email);
    console.log(`✅ Firebase user already exists: ${email}`);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      // Create the user
      try {
        await admin.auth().createUser({
          email,
          password,
          emailVerified: false,
        });
        console.log(`✅ Firebase user created: ${email}`);
      } catch (createError) {
        console.error(`❌ Failed to create Firebase user: ${email}`, createError);
        throw createError;
      }
    } else {
      console.error(`❌ Error checking Firebase user: ${email}`, error);
      throw error;
    }
  }
}

/**
 * Generate a password reset link for Firebase Authentication
 * This link will redirect to the frontend with a Firebase reset token
 */
export async function generatePasswordResetLink(
  email: string, 
  continueUrl?: string
): Promise<string> {
  try {
    const actionCodeSettings = {
      url: continueUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`,
      handleCodeInApp: false,
    };

    const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
    console.log(`✅ Password reset link generated for: ${email}`);
    return link;
  } catch (error) {
    console.error(`❌ Failed to generate password reset link for: ${email}`, error);
    throw error;
  }
}

/**
 * Generate an email verification link for Firebase Authentication
 */
export async function generateEmailVerificationLink(
  email: string,
  continueUrl?: string
): Promise<string> {
  try {
    const actionCodeSettings = {
      url: continueUrl || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email`,
      handleCodeInApp: false,
    };

    const link = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);
    console.log(`✅ Email verification link generated for: ${email}`);
    return link;
  } catch (error) {
    console.error(`❌ Failed to generate email verification link for: ${email}`, error);
    throw error;
  }
}

/**
 * Update Firebase user password
 * Used when password is changed in the database
 */
export async function updateFirebasePassword(email: string, newPassword: string): Promise<void> {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      password: newPassword,
    });
    console.log(`✅ Firebase password updated for: ${email}`);
  } catch (error) {
    console.error(`❌ Failed to update Firebase password for: ${email}`, error);
    throw error;
  }
}

/**
 * Delete a user from Firebase Authentication
 */
export async function deleteFirebaseUser(email: string): Promise<void> {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(user.uid);
    console.log(`✅ Firebase user deleted: ${email}`);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log(`⚠️ Firebase user not found (already deleted?): ${email}`);
    } else {
      console.error(`❌ Failed to delete Firebase user: ${email}`, error);
      throw error;
    }
  }
}

/**
 * Verify a Firebase ID token
 */
export async function verifyFirebaseToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(`✅ Firebase token verified for: ${decodedToken.email}`);
    return decodedToken;
  } catch (error) {
    console.error('❌ Failed to verify Firebase token', error);
    throw error;
  }
}

export default admin;
