import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueActionLogEntity } from './issue-action-log.entity';
import { IssueActionLogService } from './issue-action-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([IssueActionLogEntity])],
  providers: [IssueActionLogService],
  exports: [IssueActionLogService],
})
export class IssueActionLogModule {}
