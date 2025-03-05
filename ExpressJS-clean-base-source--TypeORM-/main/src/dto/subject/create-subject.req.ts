import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSubjectReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  subjectName!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  majorId!: string;
}
