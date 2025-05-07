import { ManagePayment } from '@/models/manage_payment.model';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IManagePaymentService } from '@/service/interface/i.manage_payment.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ManagePaymentService
  extends BaseCrudService<ManagePayment>
  implements IManagePaymentService<ManagePayment>
{
  private managePaymentRepository: IManagePaymentRepository<ManagePayment>;

  constructor(@inject('ManagePaymentRepository') managePaymentRepository: IManagePaymentRepository<ManagePayment>) {
    super(managePaymentRepository);
    this.managePaymentRepository = managePaymentRepository;
  }
}
