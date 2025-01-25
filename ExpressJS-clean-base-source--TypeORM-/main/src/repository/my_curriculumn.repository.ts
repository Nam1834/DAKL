import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class MyCurriculumnRepository
  extends BaseRepository<MyCurriculumn>
  implements IMyCurriculumnRepository<MyCurriculumn>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(MyCurriculumn));
  }
}
