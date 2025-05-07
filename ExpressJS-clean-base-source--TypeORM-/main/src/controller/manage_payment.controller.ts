import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { ManagePayment } from '@/models/manage_payment.model';
import { IManagePaymentService } from '@/service/interface/i.manage_payment.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ManagePaymentController {
  public common: IBaseCrudController<ManagePayment>;
  private managePaymentService: IManagePaymentService<ManagePayment>;
  constructor(
    @inject('ManagePaymentService') managePaymentService: IManagePaymentService<ManagePayment>,
    @inject(ITYPES.Controller) common: IBaseCrudController<ManagePayment>
  ) {
    this.managePaymentService = managePaymentService;
    this.common = common;
  }
}
