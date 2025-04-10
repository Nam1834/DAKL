import { CurriculumnStatus } from '@/enums/curriculumn-status.eum';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { optional } from 'inversify';

export class UpdateCurriculumnReq {
  @IsOptional()
  @IsString()
  curriculumnName!: string;

  @IsOptional()
  @IsString()
  majorId!: string;

  @IsOptional()
  @IsString()
  subjectId!: string;

  @IsOptional()
  @IsString()
  curriculumnUrl!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsEnum(CurriculumnStatus, { message: 'Status must be either ACTIVE or UNACTIVE' })
  status!: CurriculumnStatus;
}
