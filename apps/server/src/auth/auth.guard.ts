// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    const token = req.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('缺少 token');
    }

    const raw = await this.redisService.getClient().get(`login:${token}`);

    if (!raw) {
      throw new UnauthorizedException('登录已过期');
    }

    req.user = JSON.parse(raw);
    return true;
  }
}
