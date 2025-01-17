import { Expose } from 'class-transformer';

export class OrderItemValueConfigRes {
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
