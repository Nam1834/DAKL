import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ErrorCode } from '@/enums/error-code.enums';
import { OrderStatus } from '@/enums/order-status.enum';
import { Payment } from '@/models/payment.model';
import { IPaymentService } from '@/service/interface/i.payment.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { getSearchData } from '@/utils/get-search-data.util';
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

  async searchPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.paymentService.search(searchData);
      res.send_ok('Payment fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async searchPaymentWithTime(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      searchData.periodType = req.query.periodType as any;
      searchData.periodValue = req.query.periodValue ? Number(req.query.periodValue) : undefined;

      const result = await this.paymentService.searchWithTime(searchData);
      res.send_ok('Payment with time fetch successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getMyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const userId = user!.id;

      if (!userId) {
        throw new Error('You must login');
      }

      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.paymentService.getMyPayment(userId, searchData);
      res.send_ok('Payment fetched successfully', result);
    } catch (error) {
      next(error);
    }
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
      const vnp_TxnRef = vnp_Params['vnp_TxnRef'];
      if (typeof vnp_ResponseCode !== 'string' || typeof vnp_TxnRef !== 'string') {
        throw new Error('Thông tin phản hồi từ VNPay không hợp lệ');
      }

      if (vnp_ResponseCode !== '00') {
        // Người dùng hủy thanh toán
        if (vnp_ResponseCode === '24') {
          await this.paymentService.updateOrderStatus(vnp_TxnRef, OrderStatus.CANCELED);
        } else {
          await this.paymentService.updateOrderStatus(vnp_TxnRef, OrderStatus.FAILED);
        }
        return res.redirect(this.FE_FAIL_PAYMENT_URL);
      }

      await this.paymentService.handleVNPayReturn(vnp_Params);

      return res.redirect(this.FE_SUCCESS_PAYMENT_URL);
    } catch (error) {
      console.log('PAYMENT ERROR', error);

      return res.redirect(this.FE_FAIL_PAYMENT_URL);
    }
  }
}
