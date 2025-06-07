import { ManagePayment } from '@/models/manage_payment.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IManagePaymentRepository<T> extends IBaseRepository<T> {
  sum(field: keyof ManagePayment, filter: any): Promise<number>;
  findManagePaymentsByTutorIds(tutorIds: string[], timeStart: Date, timeEnd: Date): Promise<ManagePayment[]>;
}
