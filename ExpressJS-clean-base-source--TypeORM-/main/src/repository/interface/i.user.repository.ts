import { Curriculumn } from '@/models/curriculumn.model';
import { MyCurriculumn } from '@/models/my_curriculumn.model';
import { User } from '@/models/user.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IUserRepository<T> extends IBaseRepository<T> {
  createNewUser(user: User): Promise<void>;
  updateUserWithTransaction(user: User, myCurriculumn: MyCurriculumn, curriculumn: Curriculumn): Promise<void>;
  totalNewRequest(): Promise<number>;
}
