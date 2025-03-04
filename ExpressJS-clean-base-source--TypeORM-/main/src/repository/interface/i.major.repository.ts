import { Major } from '@/models/major.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IMajorRepository<T> extends IBaseRepository<T> {
  createNewMajor(major: Major): Promise<void>;
}
