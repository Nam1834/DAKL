import { SubjectController } from '@/controller/subject.controller';
import { SubjectService } from '@/service/subject.service';
import { Subject } from '@/models/subject.model';
import { SubjectRepository } from '@/repository/subject.repository';
import { ISubjectRepository } from '@/repository/interface/i.subject.repository';
import { BaseContainer } from '@/container/base.container';
import { ISubjectService } from '@/service/interface/i.subject.service';

class SubjectContainer extends BaseContainer {
  constructor() {
    super(Subject);
    this.container.bind<ISubjectService<Subject>>('SubjectService').to(SubjectService);
    this.container.bind<ISubjectRepository<Subject>>('SubjectRepository').to(SubjectRepository);
    this.container.bind<SubjectController>(SubjectController).toSelf();
  }

  export() {
    const subjectController = this.container.get<SubjectController>(SubjectController);
    const subjectService = this.container.get<ISubjectService<any>>('SubjectService');
    const subjectRepository = this.container.get<ISubjectRepository<any>>('SubjectRepository');

    return { subjectController, subjectService, subjectRepository };
  }
}

const subjectContainer = new SubjectContainer();
const { subjectController, subjectService, subjectRepository } = subjectContainer.export();
export { subjectController, subjectService, subjectRepository };
