import { ManagePayment } from '@/models/manage_payment.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ManagePaymentRepository
  extends BaseRepository<ManagePayment>
  implements IManagePaymentRepository<ManagePayment>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ManagePayment));
  }
}
