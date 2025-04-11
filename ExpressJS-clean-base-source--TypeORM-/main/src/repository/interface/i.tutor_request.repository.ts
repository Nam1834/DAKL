import { TutorRequest } from '@/models/tutor_request.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface ITutorRequestRepository<T> extends IBaseRepository<T> {
  createNewTutorRequest(tutorRequest: TutorRequest): Promise<void>;
}
