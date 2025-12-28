import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueEntity } from './issue.entity.js';
import { IssueService } from './issue.service.js';
import { IssueController } from './issue.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity])],
  providers: [IssueService],
  controllers: [IssueController],
})
export class IssueModule {}
