import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IssueService } from './issue.service.js';
import { IssueActionDto } from './dto/issue-action.dto.js';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  // 健康检查
  @Get('ping')
  ping() {
    return 'issue ok';
  }

  // 获取指定 issue
  @Get(':id')
  getIssue(@Param('id', ParseIntPipe) id: number) {
    const issue = this.issueService.findOne(id);
    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }

    return {
      ...issue,
      actions: this.issueService.getAvailableActions(issue.status),
    };
  }

  // 执行动作
  @Post(':id/actions')
  executeAction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IssueActionDto,
  ) {
    const issue = this.issueService.findOne(id);
    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }

    // 校验 action 是否可执行
    if (!this.issueService.canExecute(issue.status, dto.action)) {
      throw new BadRequestException(
        `Action "${dto.action}" not allowed on status "${issue.status}"`,
      );
    }

    const updatedIssue = this.issueService.executeAction(id, dto.action);
    return updatedIssue;
  }
}
