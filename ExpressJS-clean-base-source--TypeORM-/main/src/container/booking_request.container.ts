import { BookingRequestController } from '@/controller/booking_request.controller';
import { BookingRequestService } from '@/service/booking_request.service';
import { BookingRequestRepository } from '@/repository/booking_request.repository';
import { IBookingRequestService } from '@/service/interface/i.booking_request.service';
import { IBookingRequestRepository } from '@/repository/interface/i.booking_request.repository';
import { BaseContainer } from '@/container/base.container';
import { BookingRequest } from '@/models/booking_request.model';
import { tutorProfileRepository } from './tutor_profile.container';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';

class BookingRequestContainer extends BaseContainer {
  constructor() {
    super(BookingRequest);
    this.container.bind<IBookingRequestService<BookingRequest>>('BookingRequestService').to(BookingRequestService);
    this.container
      .bind<IBookingRequestRepository<BookingRequest>>('BookingRequestRepository')
      .to(BookingRequestRepository);
    this.container.bind<BookingRequestController>(BookingRequestController).toSelf();

    //Import
    this.container.bind<ITutorProfileRepository<any>>('TutorProfileRepository').toConstantValue(tutorProfileRepository);
  }

  export() {
    const bookingRequestController = this.container.get<BookingRequestController>(BookingRequestController);
    const bookingRequestService = this.container.get<IBookingRequestService<any>>('BookingRequestService');
    const bookingRequestRepository = this.container.get<IBookingRequestRepository<any>>('BookingRequestRepository');

    return { bookingRequestController, bookingRequestService, bookingRequestRepository };
  }
}

const bookingRequestContainer = new BookingRequestContainer();
const { bookingRequestController, bookingRequestService, bookingRequestRepository } = bookingRequestContainer.export();
export { bookingRequestController, bookingRequestService, bookingRequestRepository };
