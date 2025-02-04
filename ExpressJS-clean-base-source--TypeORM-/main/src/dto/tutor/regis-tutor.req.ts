import { TeachingMethod } from '@/enums/teaching-method.enum';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { CreateCurriculumnReq } from '../curriculumn/create-curriculumn.req';
export enum DegreeEnum {
  STUDENT = 'STUDENT',
  MASTER = 'MASTER',
  DOCTOR = 'DOCTOR',
  FREELANCE = 'FREELANCE'
}

export class DateTimeLearnDto {
  @IsString({ message: 'Day must be a string' })
  @IsNotEmpty({ message: 'Day must not be empty' })
  day!: string;

  @IsArray({ message: 'Times must be an array' })
  @ArrayNotEmpty({ message: 'Times must not be empty' })
  @IsString({ each: true, message: 'Each time must be a string' })
  @Matches(/^\d{2}:\d{2}$/, {
    each: true,
    message: 'Each time must follow the format "HH:mm"'
  })
  times!: string[];
}

export class RegisToTutorReq {
  @IsNotEmpty({ message: 'Avatar is required' })
  @IsString({ message: 'Avatar must be a string' })
  avatar!: string;

  @IsNotEmpty({ message: 'Major Name is required' })
  @IsString({ message: 'Major Name must be a string' })
  majorName!: string;

  @IsNotEmpty({ message: 'Teaching Certification is required' })
  @IsString({ message: 'Teaching Certification must be a string or file type' })
  teachingCetification!: string;

  @IsNotEmpty({ message: 'Degree is required.' })
  @IsEnum(DegreeEnum, { message: 'Degree must be one of: STUDENT, MASTER, DOCTOR, FREELANCE.' })
  degree!: DegreeEnum;

  @IsNotEmpty({ message: 'University is required' })
  @IsString({ message: 'University must be a string' })
  univercity!: string;

  @IsNotEmpty({ message: 'GPA is required' })
  @IsNumber({}, { message: 'GPA must be a number' })
  @Min(0, { message: 'GPA must be at least 0' })
  @Max(4, { message: 'GPA must not exceed 4' })
  GPA!: number;

  @IsNotEmpty({ message: 'Educational Certification is required' })
  @IsString()
  educationalCertification!: string;

  @IsArray({ message: 'DateTimeLearn must be an array' })
  @ArrayNotEmpty({ message: 'DateTimeLearn must not be empty' })
  @ValidateNested({ each: true })
  @Type(() => DateTimeLearnDto)
  dateTimeLearn!: DateTimeLearnDto[];

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsNotEmpty({ message: 'Educational Certification is required' })
  @IsNumber()
  teachingTime!: number;

  @IsNotEmpty()
  @IsString()
  teachingRoadMap!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  videoUrl!: string;

  @IsNotEmpty()
  @IsEnum(TeachingMethod, { message: 'teachingMethod must be one of: ONLINE, OFFLINE, BOTH.' })
  teachingMethod!: string;

  @IsNotEmpty({ message: 'Curriculumn is required.' })
  @ValidateNested()
  @Type(() => CreateCurriculumnReq)
  curriculumn!: CreateCurriculumnReq;
}
