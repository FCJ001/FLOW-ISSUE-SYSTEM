import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueActionLogModule } from '../issue-action-log/issue-action-log.module';

import { IssueEntity } from './issue.entity';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity]), IssueActionLogModule],
  providers: [IssueService],
  controllers: [IssueController],
})
export class IssueModule {}
