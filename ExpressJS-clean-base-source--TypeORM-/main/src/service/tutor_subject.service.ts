import { TutorSubject } from '@/models/tutor_subject.model';
import { ITutorSubjectRepository } from '@/repository/interface/i.tutor_subject.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITutorSubjectService } from '@/service/interface/i.tutor_subject.service';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorSubjectService extends BaseCrudService<TutorSubject> implements ITutorSubjectService<TutorSubject> {
  private tutorSubjectRepository: ITutorSubjectRepository<TutorSubject>;

  constructor(@inject('TutorSubjectRepository') tutorSubjectRepository: ITutorSubjectRepository<TutorSubject>) {
    super(tutorSubjectRepository);
    this.tutorSubjectRepository = tutorSubjectRepository;
  }
}
