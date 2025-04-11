import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ITutorRequestService<T extends BaseModelType> extends IBaseCrudService<T> {
  regisToTutor(id: string, data: RegisToTutorReq): Promise<void>;
}
