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

export class RegisToTutorReq {
  @IsNotEmpty({ message: 'Avatar is required' })
  @IsString({ message: 'Avatar must be a string' })
  avatar!: string;

  @IsNotEmpty({ message: 'fullname is required' })
  @IsString({ message: 'fullname must be a string' })
  fullname!: string;

  @IsNotEmpty({ message: 'MajorId is required' })
  @IsString({ message: 'MajorId must be a string' })
  majorId!: string;

  @IsNotEmpty()
  @IsDateString()
  birthday!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(MALE|FEMALE)$/, { message: 'Gender must be either MALE or FEMALE' })
  gender!: 'MALE' | 'FEMALE';

  @IsNotEmpty()
  @IsString()
  bankNumber!: string;

  @IsNotEmpty()
  @IsString()
  bankName!: string;

  @IsNotEmpty()
  @IsString()
  subjectId!: string;

  @IsNotEmpty()
  @IsString()
  descriptionOfSubject!: string;

  @IsNotEmpty({ message: 'University is required' })
  @IsString({ message: 'University must be a string' })
  univercity!: string;

  @IsNotEmpty({ message: 'GPA is required' })
  @IsNumber({}, { message: 'GPA must be a number' })
  @Min(0, { message: 'GPA must be at least 0' })
  @Max(4, { message: 'GPA must not exceed 4' })
  GPA!: number;

  @IsArray({ message: 'DateTimeLearn must be an array' })
  @ArrayNotEmpty({ message: 'DateTimeLearn must not be empty' })
  @ValidateNested({ each: true })
  @Type(() => DateTimeLearnDto)
  dateTimeLearn!: DateTimeLearnDto[];

  @IsNotEmpty({ message: 'Educational Certification is required' })
  @IsNumber()
  teachingTime!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  videoUrl!: string;

  @IsNotEmpty()
  @IsBoolean()
  isUseCurriculumn!: boolean;

  @IsNotEmpty()
  @IsString()
  evidenceOfGPA!: string;

  @IsNotEmpty()
  @IsString()
  evidenceOfSubject!: string;

  @IsOptional()
  @IsString()
  subjectId2!: string;

  @IsOptional()
  @IsString()
  evidenceOfSubject2!: string;

  @IsOptional()
  @IsString()
  descriptionOfSubject2!: string;

  @IsOptional()
  @IsString()
  subjectId3!: string;

  @IsOptional()
  @IsString()
  evidenceOfSubject3!: string;

  @IsOptional()
  @IsString()
  descriptionOfSubject3!: string;

  @IsNotEmpty()
  @IsEnum(TeachingMethod, { message: 'Teaching Method must be either ONLINE, OFFLINE or BOTH' })
  teachingMethod!: TeachingMethod;

  @IsNotEmpty()
  @IsString()
  teachingPlace!: string;
}
