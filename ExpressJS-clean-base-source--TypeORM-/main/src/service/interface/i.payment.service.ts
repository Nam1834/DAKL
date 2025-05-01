import { GetVnpUrl } from '@/dto/payment/get-vnp-url.res';
import { OrderStatus } from '@/enums/order-status.enum';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IPaymentService<T extends BaseModelType> extends IBaseCrudService<T> {
  handleVNPayReturn(vnp_Params: any): Promise<void>;
  getVnpUrl(paymentId: string, ipAddr: string): Promise<GetVnpUrl>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
}
