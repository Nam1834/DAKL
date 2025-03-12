import { Subject } from '@/models/subject.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface ISubjectRepository<T> extends IBaseRepository<T> {
  createNewSubject(subject: Subject): Promise<void>;
}
