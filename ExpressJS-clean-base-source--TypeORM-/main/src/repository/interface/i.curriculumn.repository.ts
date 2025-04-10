import { Curriculumn } from '@/models/curriculumn.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface ICurriculumnRepository<T> extends IBaseRepository<T> {
  createNewCurriculumn(curriculumn: Curriculumn): Promise<void>;
}
