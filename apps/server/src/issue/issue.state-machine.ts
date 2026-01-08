import { IssueAction, IssueStatus } from '@flow/shared';

export const ISSUE_STATE_MACHINE: Record<
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

export function getNextIssueStatus(
  current: IssueStatus,
  action: IssueAction,
): IssueStatus {
  const next = ISSUE_STATE_MACHINE[current]?.[action];

  if (!next) {
    throw new Error(`Action ${action} not allowed from status ${current}`);
  }

  return next;
}
