// src/issue/issue.domain.ts
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { IssueAction, IssueStatus, Role } from '@flow/shared';

export class IssueDomain {
  /**
   * 状态流转表
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
   * Action 权限表
   */
  private static readonly ACTION_ROLES: Record<IssueAction, Role[]> = {
    [IssueAction.SUBMIT]: [Role.USER],
    [IssueAction.APPROVE]: [Role.REVIEWER, Role.ADMIN],
    [IssueAction.REJECT]: [Role.REVIEWER, Role.ADMIN],
    [IssueAction.REPROCESS]: [Role.USER],
    [IssueAction.CLOSE]: [Role.ADMIN],
  };

  /**
   * 写模型：执行 action
   */
  static nextStatus(
    current: IssueStatus,
    action: IssueAction,
    role: Role,
  ): IssueStatus {
    this.assertActionAllowed(current, action, role);

    const next = this.STATE_MACHINE[current]?.[action];

    if (!next) {
      throw new BadRequestException(`状态 ${current} 下不能执行操作 ${action}`);
    }

    return next;
  }

  /**
   * 读模型：当前状态下可执行 action（带角色）
   */
  static getAvailableActions(status: IssueStatus, role: Role): IssueAction[] {
    const entries = Object.entries(this.STATE_MACHINE[status] ?? {}) as [
      IssueAction,
      IssueStatus,
    ][];

    return entries
      .filter((entry) => this.ACTION_ROLES[entry[0]]?.includes(role))
      .map((entry) => entry[0]);
  }

  /**
   * 权限校验
   */
  private static assertActionAllowed(
    status: IssueStatus,
    action: IssueAction,
    role: Role,
  ) {
    const allowedRoles = this.ACTION_ROLES[action];

    if (!allowedRoles?.includes(role)) {
      throw new ForbiddenException(`角色 ${role} 无权执行操作 ${action}`);
    }

    if (!this.STATE_MACHINE[status]?.[action]) {
      throw new BadRequestException(`状态 ${status} 下不能执行操作 ${action}`);
    }
  }
}
