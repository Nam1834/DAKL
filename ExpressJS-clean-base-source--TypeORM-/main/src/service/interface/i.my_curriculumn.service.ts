import { AddToMyCurriculumnReq } from '@/dto/my-curriculumn/add-to-my-curriculumn.req';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMyCurriculumnService<T extends BaseModelType> extends IBaseCrudService<T> {
  getMyCurriculumn(userId: string): Promise<MyCurriculumn>;
  addToMyCurrriculumn(userId: string, data: AddToMyCurriculumnReq): Promise<void>;
}
