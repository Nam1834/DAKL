import { PagingResponseDto } from '@/dto/paging-response.dto';
import { GetVnpUrl } from '@/dto/payment/get-vnp-url.res';
import { SearchDataDto } from '@/dto/search-data.dto';
import { OrderStatus } from '@/enums/order-status.enum';
import { Order } from '@/models/order.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IPaymentService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<Order>>;
  getMyPayment(userId: string, searchData: SearchDataDto): Promise<PagingResponseDto<Order>>;
  handleVNPayReturn(vnp_Params: any): Promise<void>;
  getVnpUrl(paymentId: string, ipAddr: string): Promise<GetVnpUrl>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
}
