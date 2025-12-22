import { IsString, Length, IsOptional } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  @Length(1, 200)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
