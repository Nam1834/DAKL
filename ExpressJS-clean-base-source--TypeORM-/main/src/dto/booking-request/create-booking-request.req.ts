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

export class CreateBookingRequestReq {
  @IsArray({ message: 'DateTimeLearn must be an array' })
  @ArrayNotEmpty({ message: 'DateTimeLearn must not be empty' })
  @ValidateNested({ each: true })
  @Type(() => DateTimeLearnDto)
  dateTimeLearn!: DateTimeLearnDto[];

  @IsNotEmpty()
  @IsNumber()
  lessonsPerWeek!: number;

  @IsNotEmpty()
  @IsNumber()
  totalLessons!: number;

  @IsNotEmpty()
  @IsNumber()
  hoursPerLesson!: number;

  @IsNotEmpty()
  @IsDateString()
  startDay!: string;
}
