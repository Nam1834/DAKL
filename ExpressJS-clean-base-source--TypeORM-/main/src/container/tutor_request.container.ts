import { TutorRequestController } from '@/controller/tutor_request.controller';
import { TutorRequestService } from '@/service/tutor_request.service';
import { TutorRequest } from '@/models/tutor_request.model';
import { TutorRequestRepository } from '@/repository/tutor_request.repository';
import { ITutorRequestService } from '@/service/interface/i.tutor_request.service';
import { ITutorRequestRepository } from '@/repository/interface/i.tutor_request.repository';
import { BaseContainer } from '@/container/base.container';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { userRepository } from './user.container';
import { ITestResultRepository } from '@/repository/interface/i.test_result.repository';
import { testResultRepository } from './test_result.container';
import { tutorLevelRepository } from './tutor_level.container';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { myCurriculumnRepository } from './my_curriculumn.container';
import { tutorProfileRepository } from './tutor_profile.container';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';

class TutorRequestContainer extends BaseContainer {
  constructor() {
    super(TutorRequest);
    this.container.bind<ITutorRequestService<TutorRequest>>('TutorRequestService').to(TutorRequestService);
    this.container.bind<ITutorRequestRepository<TutorRequest>>('TutorRequestRepository').to(TutorRequestRepository);
    this.container.bind<TutorRequestController>(TutorRequestController).toSelf();

    //Import
    this.container.bind<IUserRepository<any>>('UserRepository').toConstantValue(userRepository);
    this.container.bind<ITestResultRepository<any>>('TestResultRepository').toConstantValue(testResultRepository);
    this.container.bind<ITutorLevelRepository<any>>('TutorLevelRepository').toConstantValue(tutorLevelRepository);
    this.container
      .bind<IMyCurriculumnRepository<any>>('MyCurriculumnRepository')
      .toConstantValue(myCurriculumnRepository);
    this.container.bind<ITutorProfileRepository<any>>('TutorProfileRepository').toConstantValue(tutorProfileRepository);
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
