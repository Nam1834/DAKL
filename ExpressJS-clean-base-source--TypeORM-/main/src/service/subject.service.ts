import { Subject } from '@/models/subject.model';
import { ISubjectRepository } from '@/repository/interface/i.subject.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ISubjectService } from '@/service/interface/i.subject.service';
import { inject, injectable } from 'inversify';

@injectable()
export class SubjectService extends BaseCrudService<Subject> implements ISubjectService<Subject> {
  private subjectRepository: ISubjectRepository<Subject>;

  constructor(@inject('SubjectRepository') subjectRepository: ISubjectRepository<Subject>) {
    super(subjectRepository);
    this.subjectRepository = subjectRepository;
  }
}
