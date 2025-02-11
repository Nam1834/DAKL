import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateMajorReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  majorName!: string;
}
