import { TutorLevel } from '@/models/tutor_level.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class TutorLevelRepository extends BaseRepository<TutorLevel> implements ITutorLevelRepository<TutorLevel> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(TutorLevel));
  }
}
