import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSubjectReq {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  subjectName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  majorId!: string;
}
