import { CreateOrderWithValueConfigIdReq } from '@/dto/order/create-order-with-value-config-id.req';
import { Order } from '@/models/order.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IOrderService<T extends BaseModelType> extends IBaseCrudService<T> {
  createOrderWithValueConfigId(requestBody: CreateOrderWithValueConfigIdReq, userId: string): Promise<Order>;
}
