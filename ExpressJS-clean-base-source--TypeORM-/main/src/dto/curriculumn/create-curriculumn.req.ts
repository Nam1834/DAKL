import { CurriculumnStatus } from '@/enums/curriculumn-status.eum';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCurriculumnReq {
  @IsNotEmpty()
  @IsString()
  curriculumnName!: string;

  @IsNotEmpty()
  @IsString()
  majorId!: string;

  @IsNotEmpty()
  @IsString()
  subjectId!: string;

  @IsNotEmpty()
  @IsString()
  curriculumnUrl!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsEnum(CurriculumnStatus, { message: 'Status must be either ACTIVE or UNACTIVE' })
  status!: CurriculumnStatus;
}
