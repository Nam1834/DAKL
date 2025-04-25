import { BookingRequestStatus } from '@/enums/booking_request-status.enum';
import { BookingRequest } from '@/models/booking_request.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IBookingRequestRepository<T> extends IBaseRepository<T> {
  findBookingRequestsByTutorIds(
    userId: string,
    tutorIds: string[],
    status: BookingRequestStatus
  ): Promise<BookingRequest[]>;
}
