// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/user.entity';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
