import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueEntity } from './issue.entity.js';

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

  async create(data: Partial<IssueEntity>): Promise<IssueEntity> {
    const issue = this.issueRepo.create(data);
    return this.issueRepo.save(issue);
  }
}
