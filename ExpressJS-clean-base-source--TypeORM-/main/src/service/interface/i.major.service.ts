import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMajorService<T extends BaseModelType> extends IBaseCrudService<T> {
  updateMajor(id: string, data: any): Promise<void>;
}
