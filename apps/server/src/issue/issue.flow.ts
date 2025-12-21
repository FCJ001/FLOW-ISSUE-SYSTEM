import { IssueStatus, IssueAction } from '@flow/shared';

export const IssueFlowMap: Record<
  IssueStatus,
  Partial<Record<IssueAction, IssueStatus>>
> = {
  [IssueStatus.DRAFT]: { [IssueAction.SUBMIT]: IssueStatus.SUBMITTED },
  [IssueStatus.SUBMITTED]: {
    [IssueAction.APPROVE]: IssueStatus.APPROVED,
    [IssueAction.REJECT]: IssueStatus.REJECTED,
  },
  [IssueStatus.APPROVED]: {},
  [IssueStatus.REJECTED]: { [IssueAction.REPROCESS]: IssueStatus.SUBMITTED },
  [IssueStatus.CLOSED]: {},
};
