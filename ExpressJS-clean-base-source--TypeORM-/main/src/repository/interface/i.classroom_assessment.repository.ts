import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IClassroomAssessmentRepository<T> extends IBaseRepository<T> {
  countWithFilter(filter: Record<string, any>): Promise<number>;
}
