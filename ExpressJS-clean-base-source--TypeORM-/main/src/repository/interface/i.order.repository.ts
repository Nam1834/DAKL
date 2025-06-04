import { Order } from '@/models/order.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IOrderRepository<T> extends IBaseRepository<T> {
  sum(field: keyof Order, filter: any): Promise<number>;
}
