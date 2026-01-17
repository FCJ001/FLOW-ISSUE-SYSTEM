import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { IssueAction } from '@flow/shared';

import { ACTION_PERMISSION_MAP } from '../permission/action-permission.map';

@Injectable()
export class PermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('未登录');
    }

    // 从用户中提取权限
    const userPermissions: string[] =
      user?.roles?.flatMap((r: any) =>
        r.permissions?.map((p: any) => p.code),
      ) || [];

    console.log('userPermissions:', userPermissions);

    const action: IssueAction | undefined = request.body?.action;

    if (!action) {
      return true;
    }

    const needPermission = ACTION_PERMISSION_MAP[action];

    console.log('needPermission:', needPermission);

    if (!needPermission) {
      throw new ForbiddenException(`未知 action: ${action}`);
    }

    if (!userPermissions.includes(needPermission)) {
      throw new ForbiddenException('无权限执行该操作');
    }

    return true;
  }
}
