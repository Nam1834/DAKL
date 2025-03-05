import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ISubjectService<T extends BaseModelType> extends IBaseCrudService<T> {}
