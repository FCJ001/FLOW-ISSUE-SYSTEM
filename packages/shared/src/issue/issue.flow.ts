import { IssueStatus, IssueAction } from "./enums/issue.js";

/**
 * 状态机映射
 */
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

/**
 * 检查 action 是否可以执行
 */
export function canExecute(status: IssueStatus, action: IssueAction): boolean {
  const actions = IssueFlowMap[status];
  return actions ? action in actions : false;
}

/**
 * 获取执行 action 后的下一个状态
 */
export function getNextStatus(
  status: IssueStatus,
  action: IssueAction
): IssueStatus | null {
  if (!canExecute(status, action)) return null;
  return IssueFlowMap[status][action] ?? null;
}
