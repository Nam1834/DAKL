import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTutorLevelReq {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  levelName!: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  salary!: number;
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description!: string;
}
