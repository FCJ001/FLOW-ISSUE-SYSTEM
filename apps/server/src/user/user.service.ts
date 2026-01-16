import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { RoleEntity } from '../role/role.entity';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
  ) {}

  /**
   * 注册用户（默认分配 USER 角色）
   */
  async register(username: string, password: string) {
    // 1️⃣ 检查用户名是否存在
    const exist = await this.userRepo.findOneBy({ username });
    if (exist) {
      throw new BadRequestException('用户名已存在');
    }

    // 2️⃣ 查找默认角色 USER
    const defaultRole = await this.roleRepo.findOne({
      where: { code: 'USER' },
    });

    if (!defaultRole) {
      throw new BadRequestException('系统未初始化默认角色 USER');
    }

    // 3️⃣ 加密密码
    const hashed = await bcrypt.hash(password, 10);

    // 4️⃣ 创建用户
    const user = this.userRepo.create({
      username,
      password: hashed,
      roles: [defaultRole],
    });

    await this.userRepo.save(user);

    return {
      id: user.id,
      username: user.username,
      roles: user.roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
    };
  }

  /**
   * 查询单个用户（带角色）
   */
  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return {
      id: user.id,
      username: user.username,
      roles: user.roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
    };
  }

  /**
   * 分页查询用户列表（可选）
   */
  async findAll() {
    const users = await this.userRepo.find({
      relations: ['roles'],
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      roles: user.roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
    }));
  }

  /**
   * 🔥 核心功能：覆盖式更新用户角色
   */
  async updateUserRoles(userId: number, roleIds: number[]) {
    // 1️⃣ 查找用户
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // 2️⃣ 查找角色
    const roles = await this.roleRepo.findByIds(roleIds);

    if (roles.length !== roleIds.length) {
      throw new BadRequestException('部分角色不存在');
    }

    // 3️⃣ 覆盖更新
    user.roles = roles;

    await this.userRepo.save(user);

    return {
      id: user.id,
      username: user.username,
      roles: user.roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
    };
  }

  /**
   * 给用户追加一个角色
   */
  async addRoleToUser(userId: number, roleId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const role = await this.roleRepo.findOneBy({ id: roleId });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    // 防止重复添加
    if (user.roles.some((r) => r.id === roleId)) {
      throw new BadRequestException('用户已拥有该角色');
    }

    user.roles.push(role);

    await this.userRepo.save(user);

    return {
      id: user.id,
      username: user.username,
      roles: user.roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
    };
  }

  /**
   * 删除用户某个角色
   */
  async removeRoleFromUser(userId: number, roleId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const originalLength = user.roles.length;

    user.roles = user.roles.filter((r) => r.id !== roleId);

    if (user.roles.length === originalLength) {
      throw new BadRequestException('用户未拥有该角色');
    }

    await this.userRepo.save(user);

    return {
      id: user.id,
      username: user.username,
      roles: user.roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
    };
  }
}
