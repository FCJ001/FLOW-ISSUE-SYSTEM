import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { IssueAction, IssueStatus } from '@flow/shared';

import { IssueActionLogEntity } from './issue-action-log.entity';
import { QueryActionLogDto } from './dto/query-action-log.dto';

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

  async findLogsByIssue(issueId: number, query: QueryActionLogDto) {
    const { page = 1, pageSize = 10, action } = query;

    const qb = this.logRepo.createQueryBuilder('log');

    qb.where('log.issueId = :issueId', { issueId });

    if (action) {
      qb.andWhere('log.action = :action', { action });
    }

    qb.orderBy('log.createdAt', 'DESC');

    qb.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    return {
      total,
      page,
      pageSize,
      list: list.map((log) => ({
        id: log.id,
        action: log.action,
        fromStatus: log.fromStatus,
        toStatus: log.toStatus,
        operator: log.operator,
        createdAt: log.createdAt,
      })),
    };
  }
}
