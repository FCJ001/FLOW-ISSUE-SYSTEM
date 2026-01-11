import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { IssueAction, IssueStatus } from '@flow/shared';

import { IssueActionLogEntity } from './issue-action-log.entity';

@Injectable()
export class IssueActionLogService {
  constructor(
    @InjectRepository(IssueActionLogEntity)
    private readonly logRepo: Repository<IssueActionLogEntity>,
  ) {}

  async record(
    data: {
      issueId: number;
      action: IssueAction;
      fromStatus: IssueStatus;
      toStatus: IssueStatus;
      operator?: string;
    },
    manager?: EntityManager,
  ) {
    const repo = manager
      ? manager.getRepository<IssueActionLogEntity>(IssueActionLogEntity)
      : this.logRepo;

    const log = repo.create(data as DeepPartial<IssueActionLogEntity>);

    await repo.save(log);
  }

  async findByIssue(issueId: number) {
    return this.logRepo.find({
      where: { issueId },
      order: { createdAt: 'ASC' },
    });
  }
}
