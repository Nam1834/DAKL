import { Order } from '@/models/order.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IPaymentRepository<T> extends IBaseRepository<T> {}
