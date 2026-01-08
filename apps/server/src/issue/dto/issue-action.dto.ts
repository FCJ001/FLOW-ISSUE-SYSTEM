import { IsEnum } from 'class-validator';
import { IssueAction } from '@flow/shared';

export class ExecuteIssueActionDto {
  @IsEnum(IssueAction)
  action!: IssueAction;
}
