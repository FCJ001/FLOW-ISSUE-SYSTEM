import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueActionLogEntity } from '../issue-action-log/issue-action-log.entity';
import { IssueActionLogModule } from '../issue-action-log/issue-action-log.module';

import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { IssueEntity } from './issue.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IssueEntity, IssueActionLogEntity]),

    IssueActionLogModule, // 👈 关键就在这行！！！
  ],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
