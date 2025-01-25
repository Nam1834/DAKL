import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCurriculumnReq {
  @IsNotEmpty()
  @IsString()
  curriculumnName!: string;

  @IsNotEmpty()
  @IsString()
  curriculumnMajor!: string;

  @IsNotEmpty()
  @IsString()
  curriculumnUrl!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;
}
