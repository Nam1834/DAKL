import { Curriculumn } from '@/models/curriculumn.model';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { User } from '@/models/user.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IUserRepository<T> extends IBaseRepository<T> {
  updateUserWithTransaction(user: User, myCurriculumn: MyCurriculumn, curriculumn: Curriculumn): Promise<void>;
  totalNewRequest(): Promise<number>;
}
