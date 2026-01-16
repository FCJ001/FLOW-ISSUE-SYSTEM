import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { IssueAction, IssueStatus, Role } from '@flow/shared';

/**
 * Issue 领域模型（状态机 + 权限）
 */
export class IssueDomain {
  /**
   * 状态流转表（有限状态机）
   * currentStatus + action => nextStatus
   */
  private static readonly STATE_MACHINE: Record<
    IssueStatus,
    Partial<Record<IssueAction, IssueStatus>>
  > = {
    [IssueStatus.DRAFT]: {
      [IssueAction.SUBMIT]: IssueStatus.SUBMITTED,
    },

    [IssueStatus.SUBMITTED]: {
      [IssueAction.APPROVE]: IssueStatus.APPROVED,
      [IssueAction.REJECT]: IssueStatus.REJECTED,
    },

    [IssueStatus.REJECTED]: {
      [IssueAction.REPROCESS]: IssueStatus.DRAFT,
    },

    [IssueStatus.APPROVED]: {
      [IssueAction.CLOSE]: IssueStatus.CLOSED,
    },

    [IssueStatus.CLOSED]: {},
  };

  /**
   * Action 对应允许的角色（RBAC）
   */
  private static readonly ACTION_ROLES: Record<IssueAction, Role[]> = {
    [IssueAction.SUBMIT]: [Role.USER],
    [IssueAction.APPROVE]: [Role.REVIEWER, Role.ADMIN],
    [IssueAction.REJECT]: [Role.REVIEWER, Role.ADMIN],
    [IssueAction.REPROCESS]: [Role.USER],
    [IssueAction.CLOSE]: [Role.ADMIN],
  };

  // ================= 写模型 =================

  /**
   * 执行状态流转（带权限校验）
   */
  static nextStatus(
    current: IssueStatus,
    action: IssueAction,
    roles: Role[],
  ): IssueStatus {
    const allowed = roles.some((role) =>
      this.ACTION_ROLES[action]?.includes(role),
    );

    if (!allowed) {
      throw new ForbiddenException(`无权执行操作 ${action}`);
    }

    const next = this.STATE_MACHINE[current]?.[action];

    if (!next) {
      throw new BadRequestException(`状态 ${current} 下不能执行操作 ${action}`);
    }

    return next;
  }

  // ================= 读模型 =================

  /**
   * 获取当前状态 + 角色 下可执行的 actions
   * 用于前端按钮控制
   */
  static getAvailableActions(status: IssueStatus, role: Role): IssueAction[] {
    const entries = Object.entries(this.STATE_MACHINE[status] ?? {}) as [
      IssueAction,
      IssueStatus,
    ][];

    return entries
      .filter((entry) => {
        const action = entry[0];
        const roles = this.ACTION_ROLES[action];
        return Array.isArray(roles) && roles.includes(role);
      })
      .map((entry) => entry[0]);
  }

  // ================= 权限校验 =================

  /**
   * 权限 + 状态联合校验
   */
  private static assertActionAllowed(
    status: IssueStatus,
    action: IssueAction,
    role: Role,
  ) {
    if (!role) {
      throw new ForbiddenException(`未指定角色，无法执行操作 ${action}`);
    }

    const allowedRoles = this.ACTION_ROLES[action];

    if (!allowedRoles?.includes(role)) {
      throw new ForbiddenException(`角色 ${role} 无权执行操作 ${action}`);
    }

    if (!this.STATE_MACHINE[status]?.[action]) {
      throw new BadRequestException(`状态 ${status} 下不能执行操作 ${action}`);
    }
  }
}
