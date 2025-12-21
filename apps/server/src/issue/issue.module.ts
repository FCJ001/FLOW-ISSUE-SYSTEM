import { Module } from '@nestjs/common';
import { IssueService } from './issue.service.js';
import { IssueController } from './issue.controller.js';

@Module({
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
