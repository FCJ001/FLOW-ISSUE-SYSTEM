import { IssueStatus, IssueAction } from '@flow/shared';
import { canExecute, getNextStatus, IssueFlowMap } from '@flow/shared';

export class IssueService {
  private issues = [{ id: 1, title: '接口超时', status: IssueStatus.DRAFT }];

  findOne(id: number) {
    return this.issues.find((i) => i.id === id);
  }

  getAvailableActions(status: IssueStatus): IssueAction[] {
    return Object.keys(IssueFlowMap[status] ?? {}) as IssueAction[];
  }

  canExecute(status: IssueStatus, action: IssueAction): boolean {
    return canExecute(status, action);
  }

  executeAction(id: number, action: IssueAction) {
    const issue = this.findOne(id);
    if (!issue) throw new Error('Issue not found');

    const nextStatus = getNextStatus(issue.status, action)!;
    issue.status = nextStatus;

    return {
      ...issue,
      actions: this.getAvailableActions(issue.status),
    };
  }
}
