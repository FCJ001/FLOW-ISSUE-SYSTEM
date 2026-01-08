import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueAction, IssueStatus } from '@flow/shared';

import { IssueActionLogService } from '../issue-action-log/issue-action-log.service';

import { IssueEntity } from './issue.entity';
import { getNextIssueStatus } from './issue.state-machine';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

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
   * 执行 Issue 行为（状态流转）
   */
  async executeAction(
    id: number,
    action: IssueAction,
    operator?: string, // 预留用户
  ): Promise<IssueEntity> {
    const issue = await this.findOne(id);

    const fromStatus = issue.status;

    let toStatus: IssueStatus;
    try {
      toStatus = getNextIssueStatus(fromStatus, action);
    } catch (e) {
      const err = e as Error;
      throw new BadRequestException(err.message);
    }

    // 1️⃣ 更新 Issue 状态
    issue.status = toStatus;
    await this.issueRepo.save(issue);

    // 2️⃣ 写操作日志（审计）
    await this.actionLogService.record({
      issueId: issue.id,
      action,
      fromStatus,
      toStatus,
      operator,
    });

    return issue;
  }
}
