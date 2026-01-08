import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
