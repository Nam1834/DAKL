import { ValueConfig } from '@/models/value_config.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IValueConfigRepository<T> extends IBaseRepository<T> {
  createNewValueConfig(valueConfig: ValueConfig): Promise<void>;
}
