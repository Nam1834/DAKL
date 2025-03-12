import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateValueConfigReq {
  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  coinConfig!: number;

  @IsNotEmpty()
  urlConfig!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;
}
