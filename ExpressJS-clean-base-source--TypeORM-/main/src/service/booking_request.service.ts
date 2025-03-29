import { BookingRequest } from '@/models/booking_request.model';
import { IBookingRequestRepository } from '@/repository/interface/i.booking_request.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IBookingRequestService } from '@/service/interface/i.booking_request.service';
import { inject, injectable } from 'inversify';

@injectable()
export class BookingRequestService
  extends BaseCrudService<BookingRequest>
  implements IBookingRequestService<BookingRequest>
{
  private bookingRequestRepository: IBookingRequestRepository<BookingRequest>;

  constructor(@inject('BookingRequestRepository') bookingRequestRepository: IBookingRequestRepository<BookingRequest>) {
    super(bookingRequestRepository);
    this.bookingRequestRepository = bookingRequestRepository;
  }
}
