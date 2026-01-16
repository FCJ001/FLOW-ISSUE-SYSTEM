import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() body: { username: string; password: string }) {
    return this.userService.register(body.username, body.password);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post(':id/roles')
  updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { roleIds: number[] },
  ) {
    return this.userService.updateUserRoles(id, body.roleIds);
  }

  @Post(':id/roles/add')
  addRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { roleId: number },
  ) {
    return this.userService.addRoleToUser(id, body.roleId);
  }

  @Post(':id/roles/remove')
  removeRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { roleId: number },
  ) {
    return this.userService.removeRoleFromUser(id, body.roleId);
  }
}
