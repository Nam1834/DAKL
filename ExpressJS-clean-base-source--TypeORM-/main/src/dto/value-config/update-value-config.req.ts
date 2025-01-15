import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { optional } from 'inversify';

export class UpdateValueConfigReq {
  @optional()
  @IsString()
  @MaxLength(30)
  valueConfigId!: string;

  @optional()
  @IsNumber()
  price!: number;

  @optional()
  @IsNumber()
  coinConfig!: number;

  @optional()
  @IsNumber()
  urlConfig!: string;

  @optional()
  @IsString()
  description!: string;
}
