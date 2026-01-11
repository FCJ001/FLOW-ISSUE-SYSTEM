import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { IssueAction, IssueStatus } from '@flow/shared';
import { DataSource } from 'typeorm';

import { IssueActionLogService } from '../issue-action-log/issue-action-log.service';

import { IssueEntity } from './issue.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueDomain } from './issue.domain';

/**
 * 哪些状态允许编辑 Issue 基本信息
 */
const EDITABLE_STATUSES: IssueStatus[] = [
  IssueStatus.DRAFT,
  IssueStatus.REJECTED,
];

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,

    private readonly actionLogService: IssueActionLogService,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * 创建 Issue（只能是 DRAFT）
   */
  async create(dto: CreateIssueDto): Promise<IssueEntity> {
    const issue = this.issueRepo.create({
      title: dto.title,
      description: dto.description,
      status: IssueStatus.DRAFT,
    } as DeepPartial<IssueEntity>);

    return this.issueRepo.save(issue);
  }

  /**
   * 查询单个 Issue
   */
  async findOne(id: number): Promise<IssueEntity> {
    return this.issueRepo.findOneByOrFail({ id });
  }

  /**
   * 编辑 Issue（仅 DRAFT / REJECTED）
   */
  async update(id: number, dto: UpdateIssueDto): Promise<IssueEntity> {
    const issue = await this.findOne(id);

    if (!EDITABLE_STATUSES.includes(issue.status)) {
      throw new BadRequestException(
        `Issue in status ${issue.status} cannot be edited`,
      );
    }

    Object.assign(issue, dto);
    return this.issueRepo.save(issue);
  }

  /**
   * 执行 Issue 行为（状态流转）- 带事务
   */
  async executeAction(
    id: number,
    action: IssueAction,
    operator?: string,
  ): Promise<IssueEntity> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const issue = await manager
        .getRepository(IssueEntity)
        .createQueryBuilder('issue')
        .setLock('pessimistic_write')
        .where('issue.id = :id', { id })
        .getOne();

      if (!issue) {
        throw new NotFoundException(`Issue ${id} not found`);
      }

      const fromStatus = issue.status;

      let toStatus: IssueStatus;
      try {
        toStatus = IssueDomain.nextStatus(fromStatus, action);
      } catch (e) {
        throw new BadRequestException((e as Error).message);
      }

      issue.status = toStatus;
      await manager.save(issue);

      await this.actionLogService.record(
        {
          issueId: issue.id,
          action,
          fromStatus,
          toStatus,
          operator,
        },
        manager,
      );

      return issue;
    });
  }
}
