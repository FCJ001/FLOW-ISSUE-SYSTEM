// src/issue/issue.domain.ts
import { BadRequestException } from '@nestjs/common';
import { IssueAction, IssueStatus } from '@flow/shared';

export class IssueDomain {
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
   * 状态流转（写模型）
   */
  static nextStatus(current: IssueStatus, action: IssueAction): IssueStatus {
    const next = this.STATE_MACHINE[current]?.[action];

    if (!next) {
      throw new BadRequestException(`状态 ${current} 下不能执行操作 ${action}`);
    }

    return next;
  }

  /**
   * 当前状态下允许的操作（读模型）
   */
  static getAvailableActions(status: IssueStatus): IssueAction[] {
    return Object.keys(this.STATE_MACHINE[status] ?? {}) as IssueAction[];
  }
}
