import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { IssueService } from './issue.service.js';
import { CreateIssueDto } from './dto/create-issue.dto.js';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get()
  findAll() {
    return this.issueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.issueService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateIssueDto) {
    return this.issueService.create(dto);
  }
}
