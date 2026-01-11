import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueAction, IssueStatus } from '@flow/shared';
import { DataSource } from 'typeorm';

import { IssueActionLogService } from '../issue-action-log/issue-action-log.service';

import { IssueEntity } from './issue.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueDomain } from './issue.domain.js';

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
    });

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
    return this.dataSource.transaction(async (manager) => {
      const issueRepo = manager.getRepository(IssueEntity);

      // 1️⃣ 查询（行锁可选）
      const issue = await issueRepo.findOneByOrFail({ id });

      const fromStatus = issue.status;

      // 2️⃣ Domain 校验 + 状态流转
      let toStatus: IssueStatus;
      try {
        toStatus = IssueDomain.nextStatus(fromStatus, action);
      } catch (e) {
        throw new BadRequestException((e as Error).message);
      }

      // 3️⃣ 更新 Issue
      issue.status = toStatus;
      await issueRepo.save(issue);

      // 4️⃣ 写操作日志（必须使用同一个事务）
      await this.actionLogService.record(
        {
          issueId: issue.id,
          action,
          fromStatus,
          toStatus,
          operator,
        },
        manager, // ⭐ 把 manager 传下去
      );

      return issue;
    });
  }
}
