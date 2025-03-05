import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateTutorLevelReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  levelName!: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  salary!: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  description!: string;
}
