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

export class UpdatePublicProfileReq {
  @IsOptional()
  @IsBoolean()
  isPublicProfile?: boolean;
}
