import { Expose, Type } from 'class-transformer';

export class GetListValueConfigRes {
  @Expose()
  valueConfigId!: string;

  @Expose()
  price!: number;

  @Expose()
  coinConfig!: number;

  @Expose()
  urlConfig!: string;

  @Expose()
  description!: string;
}
