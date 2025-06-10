import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateAssessmentReq {
  @IsNotEmpty()
  @IsNumber()
  classroomEvaluation!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  tutorId!: string;

  @IsNotEmpty()
  @IsString()
  meetingId!: string;
}
