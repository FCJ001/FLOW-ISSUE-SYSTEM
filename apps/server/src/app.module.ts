import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import databaseConfig from './config/database.config.js';
import { IssueModule } from './issue/issue.module.js';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { RedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ✅ 类型层面必须加
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const db = config.get<{
          host: string;
          port: number;
          username: string;
          password: string;
          database: string;
        }>('database');

        if (!db) {
          throw new Error('Database config not found');
        }

        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV !== 'production',
        };
      },
    }),

    IssueModule,
    AuthModule,
    RoleModule,
    RedisModule,
    UserModule,
  ],
})
export class AppModule {}
