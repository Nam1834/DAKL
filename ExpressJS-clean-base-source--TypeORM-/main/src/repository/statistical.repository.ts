import { BaseRepository } from '@/repository/base/base.repository';
import { IStatisticalRepository } from '@/repository/interface/i.statistical.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class StatisticalRepository implements IStatisticalRepository {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {}
}
