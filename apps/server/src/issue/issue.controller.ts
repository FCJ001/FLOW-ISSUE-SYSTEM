// src/issue/issue.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { IssueService, Issue } from './issue.service.js';
import { IssueAction } from '@flow/shared';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get()
  getAllIssues() {
    return this.issueService.getAll();
  }

  @Get(':id')
  getIssue(@Param('id', ParseIntPipe) id: number) {
    const issue = this.issueService.findOne(id);
    return {
      ...issue,
      actions: this.issueService.getAvailableActions(issue.status),
    };
  }

  @Post(':id/actions')
  executeAction(
    @Param('id', ParseIntPipe) id: number,
    @Body('action') action: IssueAction,
  ) {
    return this.issueService.executeAction(id, action);
  }
}
