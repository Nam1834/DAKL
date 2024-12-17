import { BaseModelType } from '@/types/base-model.types';
import { IBaseCrudService } from './i.base.service';

export interface IAdminService<T extends BaseModelType> extends IBaseCrudService<T> {}
