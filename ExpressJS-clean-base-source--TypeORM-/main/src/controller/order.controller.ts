import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateOrderWithValueConfigIdReq } from '@/dto/order/create-order-with-value-config-id.req';
import { CreateOrderRes } from '@/dto/order/create-order.res';
import { Order } from '@/models/order.model';
import { IOrderService } from '@/service/interface/i.order.service';
import { ITYPES } from '@/types/interface.types';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class OrderController {
  public common: IBaseCrudController<Order>;
  private orderService: IOrderService<Order>;
  constructor(
    @inject('OrderService') orderService: IOrderService<Order>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Order>
  ) {
    this.orderService = orderService;
    this.common = common;
  }

  async createOrderWithValueConfigId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }

      const requestBody: CreateOrderWithValueConfigIdReq = req.body;

      const order = await this.orderService.createOrderWithValueConfigId(requestBody, userId);

      const resultDto = convertToDto(CreateOrderRes, order);

      res.send_ok('Tạo đơn mua thành công, vui lòng thanh toán', resultDto);
    } catch (error) {
      next(error);
    }
  }
}
