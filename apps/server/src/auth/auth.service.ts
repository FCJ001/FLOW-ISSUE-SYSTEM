import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['roles'], // ⭐ 核心
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('密码错误');
    }

    return {
      userId: user.id,
      username: user.username,
      roles: user.roles.map((r) => r.code),
    };
  }
}
