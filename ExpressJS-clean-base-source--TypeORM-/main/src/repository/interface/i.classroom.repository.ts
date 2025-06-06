import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IClassroomRepository<T> extends IBaseRepository<T> {
  updateManyStatus(classroomIds: string[], status: string): Promise<void>;
}
