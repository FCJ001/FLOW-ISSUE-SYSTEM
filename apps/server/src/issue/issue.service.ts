import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IssueStatus, IssueAction } from '@flow/shared';
import { IssueFlowMap } from './issue.flow.js';

export interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
}

@Injectable()
export class IssueService {
  private issues: Issue[] = [
    { id: 1, title: '接口超时', status: IssueStatus.DRAFT },
    { id: 2, title: '页面报错', status: IssueStatus.SUBMITTED },
  ];

  findOne(id: number): Issue {
    const issue = this.issues.find((i) => i.id === id);
    if (!issue) throw new NotFoundException(`Issue ${id} not found`);
    return issue;
  }

  getAvailableActions(status: IssueStatus): IssueAction[] {
    const flow = IssueFlowMap[status];
    if (!flow) return [];
    return Object.keys(flow) as IssueAction[];
  }

  executeAction(
    id: number,
    action: IssueAction,
  ): Issue & { actions: IssueAction[] } {
    const issue = this.findOne(id);

    const flow = IssueFlowMap[issue.status];
    if (!flow || !flow[action]) throw new BadRequestException('Invalid action');

    // 更新状态
    issue.status = flow[action];

    // 返回最新 issue 及可执行动作
    return {
      ...issue,
      actions: this.getAvailableActions(issue.status),
    };
  }

  getAll(): (Issue & { actions: IssueAction[] })[] {
    return this.issues.map((i) => ({
      ...i,
      actions: this.getAvailableActions(i.status),
    }));
  }
}
