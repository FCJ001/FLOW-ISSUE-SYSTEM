import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueAction, IssueStatus } from '@flow/shared';

import { IssueActionLogEntity } from './issue-action-log.entity';

@Injectable()
export class IssueActionLogService {
  constructor(
    @InjectRepository(IssueActionLogEntity)
    private readonly logRepo: Repository<IssueActionLogEntity>,
  ) {}

  async record(params: {
    issueId: number;
    action: IssueAction;
    fromStatus: IssueStatus;
    toStatus: IssueStatus;
    operator?: string;
  }) {
    const log = this.logRepo.create(params);
    return this.logRepo.save(log);
  }

  async findByIssue(issueId: number) {
    return this.logRepo.find({
      where: { issueId },
      order: { createdAt: 'ASC' },
    });
  }
}
