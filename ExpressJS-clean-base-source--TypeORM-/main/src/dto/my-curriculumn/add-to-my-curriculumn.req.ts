import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AddToMyCurriculumnReq {
  @IsNotEmpty()
  @IsString()
  curriculumnId!: string;
}
