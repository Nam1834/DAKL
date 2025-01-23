import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { ErrorCode } from '@/enums/error-code.enums';
import { Payment } from '@/models/payment.model';
import { IPaymentService } from '@/service/interface/i.payment.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { checkVnpReturnUtil } from '@/utils/vnpay/check-vnp-return.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import requestIp from 'request-ip';

@injectable()
export class PaymentController {
  public common: IBaseCrudController<Payment>;
  private paymentService: IPaymentService<Payment>;

  private FE_SUCCESS_PAYMENT_URL = 'https://giasuvlu.click/payment/success';
  private FE_FAIL_PAYMENT_URL = 'https://giasuvlu.click/payment/failed';
  constructor(
    @inject('PaymentService') paymentService: IPaymentService<Payment>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Payment>
  ) {
    this.paymentService = paymentService;
    this.common = common;
  }

  async getVnpUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.params;
      const ipAddr = requestIp.getClientIp(req);

      if (!ipAddr) {
        throw new BaseError(ErrorCode.VALIDATION_ERROR, 'IP Address not found');
      }

      const result = await this.paymentService.getVnpUrl(paymentId, ipAddr);

      return res.send_ok('Generate url success', result);
    } catch (error) {
      next(error);
    }
  }

  async vnpReturn(req: Request, res: Response, next: NextFunction) {
    try {
      checkVnpReturnUtil(req);

      const vnp_Params = req.query;

      const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
      if (vnp_ResponseCode !== '00') {
        return res.redirect(this.FE_FAIL_PAYMENT_URL); // Điều hướng đến trang thất bại
      }

      await this.paymentService.handleVNPayReturn(vnp_Params);

      return res.redirect(this.FE_SUCCESS_PAYMENT_URL);
    } catch (error) {
      console.log('PAYMENT ERROR', error);

      return res.redirect(this.FE_FAIL_PAYMENT_URL);
    }
  }
}
