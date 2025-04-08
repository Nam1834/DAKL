import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddToMyTutorReq {
  @IsNotEmpty()
  @IsString()
  tutorId!: string;
}
