import { IsEnum } from 'class-validator';
import { IssueAction } from '@flow/shared';

export class IssueActionDto {
  @IsEnum(IssueAction, { message: 'Invalid action' })
  action!: IssueAction; // 添加 !
}
