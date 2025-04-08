import { AddToMyTutorReq } from '@/dto/my-tutor/add-to-my-tutor.req';
import { MyTutor } from '@/models/my_tutor.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMyTutorService<T extends BaseModelType> extends IBaseCrudService<T> {
  getMyTutor(userId: string): Promise<MyTutor>;
  removeFromMyTutor(userId: string, tutorId: string): Promise<void>;
  addToMyTutor(userId: string, data: AddToMyTutorReq): Promise<void>;
}
