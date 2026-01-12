import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';

import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { ExecuteIssueActionDto } from './dto/issue-action.dto';
import { QueryIssueDto } from './dto/query-issue.dto';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post()
  create(@Body() dto: CreateIssueDto) {
    return this.issueService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.issueService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIssueDto) {
    return this.issueService.update(id, dto);
  }

  @Post(':id/actions')
  executeAction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ExecuteIssueActionDto,
  ) {
    return this.issueService.executeAction(id, dto.action);
  }

  @Post('search')
  findList(@Body() dto: QueryIssueDto) {
    return this.issueService.findList(dto);
  }
}
