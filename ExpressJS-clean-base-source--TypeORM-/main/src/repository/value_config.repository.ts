import { ValueConfig } from '@/models/value_config.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ValueConfigRepository extends BaseRepository<ValueConfig> implements IValueConfigRepository<ValueConfig> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ValueConfig));
  }
}
