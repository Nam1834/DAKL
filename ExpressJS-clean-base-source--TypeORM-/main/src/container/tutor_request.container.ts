import { TutorRequestController } from '@/controller/tutor_request.controller';
import { TutorRequestService } from '@/service/tutor_request.service';
import { TutorRequest } from '@/models/tutor_request.model';
import { TutorRequestRepository } from '@/repository/tutor_request.repository';
import { ITutorRequestService } from '@/service/interface/i.tutor_request.service';
import { ITutorRequestRepository } from '@/repository/interface/i.tutor_request.repository';
import { BaseContainer } from '@/container/base.container';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { userRepository } from './user.container';

class TutorRequestContainer extends BaseContainer {
  constructor() {
    super(TutorRequest);
    this.container.bind<ITutorRequestService<TutorRequest>>('TutorRequestService').to(TutorRequestService);
    this.container.bind<ITutorRequestRepository<TutorRequest>>('TutorRequestRepository').to(TutorRequestRepository);
    this.container.bind<TutorRequestController>(TutorRequestController).toSelf();

    //Import
    this.container.bind<IUserRepository<any>>('UserRepository').toConstantValue(userRepository);
  }

  export() {
    const tutorRequestController = this.container.get<TutorRequestController>(TutorRequestController);
    const tutorRequestService = this.container.get<ITutorRequestService<any>>('TutorRequestService');
    const tutorRequestRepository = this.container.get<ITutorRequestRepository<any>>('TutorRequestRepository');

    return { tutorRequestController, tutorRequestService, tutorRequestRepository };
  }
}

const tutorRequestContainer = new TutorRequestContainer();
const { tutorRequestController, tutorRequestService, tutorRequestRepository } = tutorRequestContainer.export();
export { tutorRequestController, tutorRequestService, tutorRequestRepository };
