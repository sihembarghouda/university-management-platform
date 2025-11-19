import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdminService } from './admin.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
