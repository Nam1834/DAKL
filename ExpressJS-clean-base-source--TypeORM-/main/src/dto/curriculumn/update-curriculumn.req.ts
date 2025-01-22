import { CurriculumnStatus } from '@/enums/curriculumn-status.eum';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { optional } from 'inversify';

export class UpdateCurriculumnReq {
  @optional()
  @IsString()
  curriculumnName!: string;

  @optional()
  @IsString()
  curriculumnMajor!: string;

  @optional()
  @IsString()
  curriculumnUrl!: string;

  @optional()
  @IsString()
  desciption!: string;

  @optional()
  @IsEnum(CurriculumnStatus, { message: 'Status must be either ACTIVE or UNACTIVE' })
  status!: CurriculumnStatus;
}
