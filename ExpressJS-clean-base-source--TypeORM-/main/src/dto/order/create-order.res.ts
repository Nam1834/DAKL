import { Expose, Type } from 'class-transformer';
import { CreatePaymentRes } from '@/dto/payment/create-payment.res';
import { CreateOrderItemRes } from '../order-item/create-order-item.res';

export class CreateOrderRes {
  @Expose()
  orderId!: string;

  @Expose()
  totalPrice!: number;

  @Expose()
  paymentId?: string;

  @Expose()
  @Type(() => CreatePaymentRes)
  payment?: CreatePaymentRes;

  @Expose()
  @Type(() => CreateOrderItemRes)
  items!: CreateOrderItemRes[];

  @Expose()
  studentId!: string;

  @Expose()
  status!: string;
}
