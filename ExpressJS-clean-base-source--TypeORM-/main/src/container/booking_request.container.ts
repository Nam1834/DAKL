import { BookingRequestController } from '@/controller/booking_request.controller';
import { BookingRequestService } from '@/service/booking_request.service';
import { BookingRequestRepository } from '@/repository/booking_request.repository';
import { IBookingRequestService } from '@/service/interface/i.booking_request.service';
import { IBookingRequestRepository } from '@/repository/interface/i.booking_request.repository';
import { BaseContainer } from '@/container/base.container';
import { BookingRequest } from '@/models/booking_request.model';
import { tutorProfileRepository } from './tutor_profile.container';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { userRepository } from './user.container';
import { IUserProfileRepository } from '@/repository/interface/i.user_profile.repository';
import { userProfileRepository } from './user_profile.container';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { classroomRepository } from './classroom.container';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import { managePaymentRepository } from './manage_payment.container';

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
    this.container.bind<IUserProfileRepository<any>>('UserProfileRepository').toConstantValue(userProfileRepository);
    this.container.bind<IUserRepository<any>>('UserRepository').toConstantValue(userRepository);
    this.container.bind<IClassroomRepository<any>>('ClassroomRepository').toConstantValue(classroomRepository);
    this.container
      .bind<IManagePaymentRepository<any>>('ManagePaymentRepository')
      .toConstantValue(managePaymentRepository);
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
