import { Major } from '@/models/major.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IMajorRepository } from '@/repository/interface/i.major.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class MajorRepository extends BaseRepository<Major> implements IMajorRepository<Major> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Major));
  }
}
