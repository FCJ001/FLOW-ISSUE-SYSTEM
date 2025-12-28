import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueStatus } from '@flow/shared';

import { IssueEntity } from './issue.entity.js';
import { CreateIssueDto } from './dto/create-issue.dto.js';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,
  ) {}

  async findAll(): Promise<IssueEntity[]> {
    return this.issueRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<IssueEntity> {
    const issue = await this.issueRepo.findOne({ where: { id } });

    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }

    return issue;
  }

  async create(dto: CreateIssueDto): Promise<IssueEntity> {
    const issue = this.issueRepo.create({
      title: dto.title,
      description: dto.description,
      status: IssueStatus.DRAFT, // 🔒 后端控制
    });

    return this.issueRepo.save(issue);
  }
}
