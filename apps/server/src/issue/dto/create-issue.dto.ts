import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @IsString()
  module?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  priority!: 'LOW' | 'MEDIUM' | 'HIGH';

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  tags?: string[];

  @IsOptional()
  assigneeId?: number;

  @IsOptional()
  reviewerId?: number;

  @IsOptional()
  ccUsers?: number[];

  @IsOptional()
  deadline?: Date;

  @IsOptional()
  expectTime?: Date;

  @IsOptional()
  department?: string;

  @IsOptional()
  project?: string;

  @IsOptional()
  version?: string;

  @IsOptional()
  env?: string;

  @IsOptional()
  slaLevel?: string;
}
