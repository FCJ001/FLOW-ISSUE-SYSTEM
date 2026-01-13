import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleModule } from '../role/role.module';

import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RoleModule],
  exports: [TypeOrmModule],
})
export class UserModule {}
