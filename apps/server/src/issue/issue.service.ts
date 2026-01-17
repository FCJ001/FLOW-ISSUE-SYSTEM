import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { IssueAction, IssueStatus } from '@flow/shared';
import { DataSource } from 'typeorm';

import { IssueActionLogService } from '../issue-action-log/issue-action-log.service';
import { RedisService } from '../redis/redis.service';

import { IssueEntity } from './issue.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueDomain } from './issue.domain';
import { QueryIssueDto } from './dto/query-issue.dto';

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

    private readonly redisService: RedisService,
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
    user: any, // 直接传完整 user 对象
  ): Promise<IssueEntity> {
    const redis = this.redisService.getClient();
    const key = `issue:action:${id}:${action}`;

    const result = await redis.multi().setnx(key, '1').expire(key, 10).exec();

    const setnxResult = result?.[0]?.[1];

    if (setnxResult !== 1) {
      throw new BadRequestException('请勿重复提交');
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
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

        // ⭐ 从 user 中提取真实权限
        const permissions: string[] =
          user.roles?.flatMap((r: any) =>
            r.permissions?.map((p: any) => p.code),
          ) || [];

        const toStatus = IssueDomain.nextStatus(
          fromStatus,
          action,
          permissions,
        );

        issue.status = toStatus;
        await manager.save(issue);

        await this.actionLogService.record(
          {
            issueId: issue.id,
            action,
            fromStatus,
            toStatus,
            operator: user.id.toString(),
          },
          manager,
        );

        return issue;
      });
    } catch (err) {
      await redis.del(key);
      throw err;
    }
  }

  async findList(query: QueryIssueDto, user: any) {
    const {
      page = 1,
      pageSize = 10,
      status,
      keyword,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query;

    const qb = this.issueRepo.createQueryBuilder('issue');

    if (status) {
      qb.andWhere('issue.status = :status', { status });
    }

    if (keyword) {
      qb.andWhere('(issue.title LIKE :kw OR issue.description LIKE :kw)', {
        kw: `%${keyword}%`,
      });
    }

    const SORT_FIELD_MAP = {
      createdAt: 'issue.createdAt',
      updatedAt: 'issue.updatedAt',
      title: 'issue.title',
    } as const;

    const sortColumn =
      SORT_FIELD_MAP[sortBy as keyof typeof SORT_FIELD_MAP] ??
      SORT_FIELD_MAP.createdAt;

    const safeOrder: 'ASC' | 'DESC' = order === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(sortColumn, safeOrder);

    qb.skip((page - 1) * pageSize).take(pageSize);

    const [list, total] = await qb.getManyAndCount();

    // ⭐ 从 user 中提取真实权限
    const permissions: string[] =
      user.roles?.flatMap((r: any) => r.permissions?.map((p: any) => p.code)) ||
      [];

    return {
      total,
      page,
      pageSize,
      list: list.map((issue) => ({
        id: issue.id,
        title: issue.title,
        status: issue.status,
        createdAt: issue.createdAt,
        availableActions: IssueDomain.getAvailableActions(
          issue.status,
          permissions,
        ),
      })),
    };
  }
}
