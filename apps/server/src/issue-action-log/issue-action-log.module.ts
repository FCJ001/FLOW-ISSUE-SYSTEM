import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueActionLogEntity } from './issue-action-log.entity';
import { IssueActionLogService } from './issue-action-log.service';
import { IssueActionLogController } from './issue-action-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IssueActionLogEntity])],
  providers: [IssueActionLogService],
  controllers: [IssueActionLogController],
  exports: [IssueActionLogService],
})
export class IssueActionLogModule {}
