import { TutorSubjectController } from '@/controller/tutor_subject.controller';
import { TutorSubjectService } from '@/service/tutor_subject.service';
import { TutorSubject } from '@/models/tutor_subject.model';
import { TutorSubjectRepository } from '@/repository/tutor_subject.repository';
import { ITutorSubjectService } from '@/service/interface/i.tutor_subject.service';
import { ITutorSubjectRepository } from '@/repository/interface/i.tutor_subject.repository';
import { BaseContainer } from '@/container/base.container';

class TutorSubjectContainer extends BaseContainer {
  constructor() {
    super(TutorSubject);
    this.container.bind<ITutorSubjectService<TutorSubject>>('TutorSubjectService').to(TutorSubjectService);
    this.container.bind<ITutorSubjectRepository<TutorSubject>>('TutorSubjectRepository').to(TutorSubjectRepository);
    this.container.bind<TutorSubjectController>(TutorSubjectController).toSelf();
  }

  export() {
    const tutorSubjectController = this.container.get<TutorSubjectController>(TutorSubjectController);
    const tutorSubjectService = this.container.get<ITutorSubjectService<any>>('TutorSubjectService');
    const tutorSubjectRepository = this.container.get<ITutorSubjectRepository<any>>('TutorSubjectRepository');

    return { tutorSubjectController, tutorSubjectService, tutorSubjectRepository };
  }
}

const tutorSubjectContainer = new TutorSubjectContainer();
const { tutorSubjectController, tutorSubjectService, tutorSubjectRepository } = tutorSubjectContainer.export();
export { tutorSubjectController, tutorSubjectService, tutorSubjectRepository };
