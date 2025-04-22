import { CreateBookingRequestReq } from '@/dto/booking-request/create-booking-request.req';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IBookingRequestService<T extends BaseModelType> extends IBaseCrudService<T> {
  createBooking(userId: string, tutorId: string, data: CreateBookingRequestReq): Promise<void>;
}
