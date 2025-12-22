import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { IssueService } from './issue.service.js';
import { IssueEntity } from './issue.entity.js';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  // 1️⃣ 列表
  @Get()
  getList(): Promise<IssueEntity[]> {
    return this.issueService.findAll();
  }

  // 2️⃣ 详情
  @Get(':id')
  getDetail(@Param('id') id: string): Promise<IssueEntity> {
    return this.issueService.findOne(Number(id));
  }

  // 3️⃣ 创建
  @Post()
  create(@Body() body: Partial<IssueEntity>): Promise<IssueEntity> {
    return this.issueService.create(body);
  }
}
