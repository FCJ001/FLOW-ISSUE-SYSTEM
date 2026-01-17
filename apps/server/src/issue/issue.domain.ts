import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { IssueAction, IssueStatus } from '@flow/shared';

export class IssueDomain {
  /**
   * 状态流转表（不变）
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
   * ⭐ Action → Permission 的映射（核心改造点）
   */
  private static readonly ACTION_PERMISSIONS: Record<IssueAction, string> = {
    [IssueAction.SUBMIT]: 'issue:create',
    [IssueAction.APPROVE]: 'issue:approve',
    [IssueAction.REJECT]: 'issue:reject',
    [IssueAction.REPROCESS]: 'issue:create',
    [IssueAction.CLOSE]: 'issue:close',
  };

  /**
   * 执行动作（写模型）
   *
   * @param current 当前状态
   * @param action 要执行的动作
   * @param userPermissions 用户拥有的权限列表
   */
  static nextStatus(
    current: IssueStatus,
    action: IssueAction,
    userPermissions: string[],
  ): IssueStatus {
    this.assertActionAllowed(current, action, userPermissions);

    const next = this.STATE_MACHINE[current]?.[action];

    if (!next) {
      throw new BadRequestException(`状态 ${current} 下不能执行操作 ${action}`);
    }

    return next;
  }

  /**
   * 读模型：获取当前状态下【用户真实可执行】的 actions
   */
  static getAvailableActions(
    status: IssueStatus,
    userPermissions: string[],
  ): IssueAction[] {
    const actions = Object.keys(
      this.STATE_MACHINE[status] ?? {},
    ) as IssueAction[];

    return actions.filter((action) => {
      const needPermission = this.ACTION_PERMISSIONS[action];
      return userPermissions.includes(needPermission);
    });
  }

  /**
   * 权限校验核心逻辑
   */
  private static assertActionAllowed(
    status: IssueStatus,
    action: IssueAction,
    userPermissions: string[],
  ) {
    const needPermission = this.ACTION_PERMISSIONS[action];

    if (!userPermissions.includes(needPermission)) {
      throw new ForbiddenException(`无权限执行操作 ${action}`);
    }

    if (!this.STATE_MACHINE[status]?.[action]) {
      throw new BadRequestException(`状态 ${status} 下不能执行操作 ${action}`);
    }
  }
}
