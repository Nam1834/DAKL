import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateValueConfigReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  valueConfigId!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  coinConfig!: number;

  @IsNotEmpty()
  @IsNumber()
  urlConfig!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;
}
