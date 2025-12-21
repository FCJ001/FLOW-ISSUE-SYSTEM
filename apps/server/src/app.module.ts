import { Module } from '@nestjs/common';
import { IssueModule } from './issue/issue.module.js';

@Module({
  imports: [IssueModule],
})
export class AppModule {}
