import { IssueAction } from '@flow/shared';

export const ACTION_PERMISSION_MAP: Record<IssueAction, string> = {
  // ⭐ 关键：SUBMIT 用 create 权限
  [IssueAction.SUBMIT]: 'issue:create',
  [IssueAction.APPROVE]: 'issue:approve',
  [IssueAction.REJECT]: 'issue:reject',
  [IssueAction.CLOSE]: 'issue:close',
  [IssueAction.REPROCESS]: 'issue:create',
};
