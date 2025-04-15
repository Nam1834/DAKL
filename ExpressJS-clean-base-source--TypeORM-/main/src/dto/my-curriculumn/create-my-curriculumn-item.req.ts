import { CurriculumnStatus } from '@/enums/curriculumn-status.eum';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMyCurriculumnItemReq {
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
}
