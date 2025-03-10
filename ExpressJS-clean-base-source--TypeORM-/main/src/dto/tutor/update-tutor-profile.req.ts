import { TeachingMethod } from '@/enums/teaching-method.enum';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { CreateCurriculumnReq } from '../curriculumn/create-curriculumn.req';
import { optional } from 'inversify';
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

export class UpdateTutorProfileReq {
  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  avatar!: string;

  @IsOptional()
  @IsString({ message: 'fullname must be a string' })
  fullname!: string;

  @IsOptional()
  @IsString({ message: 'MajorId must be a string' })
  majorId!: string;

  @IsOptional()
  @IsDateString()
  birthday!: string;

  @IsOptional()
  @IsString()
  @Matches(/^(MALE|FEMALE)$/, { message: 'Gender must be either MALE or FEMALE' })
  gender!: 'MALE' | 'FEMALE';

  @IsOptional()
  @IsString()
  bankNumber!: string;

  @IsOptional()
  @IsString()
  bankName!: string;

  @IsOptional()
  @IsString()
  subjectId!: string;

  @IsOptional()
  @IsString()
  GPAOrNameDegree!: string;

  @IsOptional()
  @IsString()
  descriptionOfSubject!: string;

  @IsOptional()
  @IsString({ message: 'University must be a string' })
  univercity!: string;

  @IsOptional()
  @IsNumber({}, { message: 'GPA must be a number' })
  @Min(0, { message: 'GPA must be at least 0' })
  @Max(4, { message: 'GPA must not exceed 4' })
  GPA!: number;

  @IsOptional()
  @IsString()
  educationalCertification!: string;

  @IsOptional()
  @IsArray({ message: 'DateTimeLearn must be an array' })
  @ValidateNested({ each: true })
  @Type(() => DateTimeLearnDto)
  dateTimeLearn!: DateTimeLearnDto[];

  @IsOptional()
  @IsNumber()
  teachingTime!: number;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  videoUrl!: string;

  @IsOptional()
  @IsBoolean()
  isPublicProfile!: boolean;
}
