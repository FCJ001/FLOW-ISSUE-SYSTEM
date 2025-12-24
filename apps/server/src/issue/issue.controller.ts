import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { IssueService } from './issue.service.js';
import { ApiResponse } from '../common/dto/api-response.dto.js';
import { CreateIssueDto } from './dto/create-issue.dto.js';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  // 1️⃣ 列表
  @Get()
  async findAll() {
    const list = await this.issueService.findAll();
    return ApiResponse.success(list);
  }

  // 2️⃣ 详情
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const issue = await this.issueService.findOne(id);
    return ApiResponse.success(issue);
  }

  // 3️⃣ 创建
  @Post()
  async create(@Body() dto: CreateIssueDto) {
    const issue = await this.issueService.create(dto);
    return ApiResponse.success(issue);
  }
}
