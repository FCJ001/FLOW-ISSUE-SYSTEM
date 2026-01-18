import {
  Controller,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { IssueActionLogService } from './issue-action-log.service';
import { QueryActionLogDto } from './dto/query-action-log.dto';

@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssueActionLogController {
  constructor(private readonly logService: IssueActionLogService) {}

  @Post(':id/logs/search')
  findLogs(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: QueryActionLogDto,
  ) {
    return this.logService.findLogsByIssue(id, dto);
  }
}
