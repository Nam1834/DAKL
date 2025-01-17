import { Expose, Type } from 'class-transformer';
import { OrderItemValueConfigRes } from '../value-config/order-item-value-config.res';

export class CreateOrderItemRes {
  @Expose()
  orderItemId!: string;

  @Expose()
  price!: number;

  @Expose()
  valueConfigId!: string;

  @Expose()
  @Type(() => OrderItemValueConfigRes)
  valueConfig!: OrderItemValueConfigRes;
}
