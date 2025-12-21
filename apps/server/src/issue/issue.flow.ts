// src/issue/issue.flow.ts
import { IssueAction, IssueStatus } from '@flow/shared';

export const IssueFlowMap: Record<
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

  [IssueStatus.APPROVED]: {
    [IssueAction.CLOSE]: IssueStatus.CLOSED,
  },

  [IssueStatus.REJECTED]: {},

  [IssueStatus.CLOSED]: {},
};
