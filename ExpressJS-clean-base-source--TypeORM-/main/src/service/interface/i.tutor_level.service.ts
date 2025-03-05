import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ITutorLevelService<T extends BaseModelType> extends IBaseCrudService<T> {}
