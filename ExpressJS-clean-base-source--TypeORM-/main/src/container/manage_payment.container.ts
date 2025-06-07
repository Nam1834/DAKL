import { ManagePaymentController } from '@/controller/manage_payment.controller';
import { ManagePaymentService } from '@/service/manage_payment.service';
import { ManagePayment } from '@/models/manage_payment.model';
import { ManagePaymentRepository } from '@/repository/manage_payment.repository';
import { IManagePaymentService } from '@/service/interface/i.manage_payment.service';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import { BaseContainer } from '@/container/base.container';
import { tutorProfileRepository } from './tutor_profile.container';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { IBookingRequestRepository } from '@/repository/interface/i.booking_request.repository';
import { bookingRequestRepository } from './booking_request.container';
import { BookingRequestRepository } from '@/repository/booking_request.repository';

class ManagePaymentContainer extends BaseContainer {
  constructor() {
    super(ManagePayment);
    this.container.bind<IManagePaymentService<ManagePayment>>('ManagePaymentService').to(ManagePaymentService);
    this.container.bind<IManagePaymentRepository<ManagePayment>>('ManagePaymentRepository').to(ManagePaymentRepository);
    this.container.bind<ManagePaymentController>(ManagePaymentController).toSelf();

    //Import
    this.container.bind<ITutorProfileRepository<any>>('TutorProfileRepository').toConstantValue(tutorProfileRepository);
    this.container.bind<IBookingRequestRepository<any>>('BookingRequestRepository').to(BookingRequestRepository);
  }

  export() {
    const managePaymentController = this.container.get<ManagePaymentController>(ManagePaymentController);
    const managePaymentService = this.container.get<IManagePaymentService<any>>('ManagePaymentService');
    const managePaymentRepository = this.container.get<IManagePaymentRepository<any>>('ManagePaymentRepository');

    return { managePaymentController, managePaymentService, managePaymentRepository };
  }
}

const managePaymentContainer = new ManagePaymentContainer();
const { managePaymentController, managePaymentService, managePaymentRepository } = managePaymentContainer.export();
export { managePaymentController, managePaymentService, managePaymentRepository };
