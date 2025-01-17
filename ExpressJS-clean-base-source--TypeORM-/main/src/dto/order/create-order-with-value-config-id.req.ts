import { CreateOrderReq } from '@/dto/order/create-order.req';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderWithValueConfigIdReq extends CreateOrderReq {
  @IsNotEmpty()
  valueConfigId!: string;
}
