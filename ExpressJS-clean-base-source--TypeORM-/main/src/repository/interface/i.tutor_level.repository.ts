import { TutorLevel } from '@/models/tutor_level.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface ITutorLevelRepository<T> extends IBaseRepository<T> {
  createNewTutorLevel(tutorLevel: TutorLevel): Promise<void>;
}
