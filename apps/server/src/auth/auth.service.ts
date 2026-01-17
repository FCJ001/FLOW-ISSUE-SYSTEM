import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../role/role.entity';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exist = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (exist) {
      throw new BadRequestException('用户名已存在');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const defaultRole = await this.roleRepo.findOne({
      where: { code: 'USER' },
    });

    if (!defaultRole) {
      throw new BadRequestException('系统未初始化默认角色 USER');
    }

    const user = this.userRepo.create({
      username: dto.username,
      password: hashed,
      roles: [defaultRole],
    });

    await this.userRepo.save(user);

    return {
      id: user.id,
      username: user.username,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('密码错误');
    }

    const payload = {
      userId: user.id,
      roles: user.roles.map((r) => r.code),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(userId: number) {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
  }
}
