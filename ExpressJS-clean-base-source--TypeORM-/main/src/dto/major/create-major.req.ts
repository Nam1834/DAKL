import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMajorReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  sumName!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  majorName!: string;
}
