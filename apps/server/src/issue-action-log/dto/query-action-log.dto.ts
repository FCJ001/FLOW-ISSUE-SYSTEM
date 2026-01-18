import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { IssueAction } from '@flow/shared';

export class QueryActionLogDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsEnum(IssueAction)
  action?: IssueAction;
}
