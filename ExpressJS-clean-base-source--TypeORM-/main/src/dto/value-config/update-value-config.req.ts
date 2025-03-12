import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { optional } from 'inversify';

export class UpdateValueConfigReq {
  @IsOptional()
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  coinConfig!: number;

  @IsOptional()
  urlConfig!: string;

  @IsOptional()
  @IsString()
  description!: string;
}
