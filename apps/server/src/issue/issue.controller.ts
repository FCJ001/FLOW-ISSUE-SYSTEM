import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@flow/shared';
import { Headers } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

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

  @UseGuards(JwtAuthGuard)
  @Post(':id/actions')
  executeAction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ExecuteIssueActionDto,
    @CurrentUser() user: any,
  ) {
    return this.issueService.executeAction(
      id,
      dto.action,
      user.roles,
      user.id.toString(),
    );
  }

  @Post('search')
  findList(@Body() dto: QueryIssueDto, @Headers('x-role') role: Role) {
    return this.issueService.findList(dto, role);
  }
}
