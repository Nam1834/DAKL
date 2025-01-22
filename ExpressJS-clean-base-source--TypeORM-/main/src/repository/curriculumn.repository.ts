import { Curriculumn } from '@/models/curriculumn.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ICurriculumnRepository } from '@/repository/interface/i.curriculumn.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class CurriculumnRepository extends BaseRepository<Curriculumn> implements ICurriculumnRepository<Curriculumn> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Curriculumn));
  }
}
