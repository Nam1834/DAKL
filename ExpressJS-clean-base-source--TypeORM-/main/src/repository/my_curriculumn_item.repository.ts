import { MyCurriculumnItem } from '@/models/my-curriculumn-item.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IMyCurriculumnItemRepository } from '@/repository/interface/i.my_curriculumn_item.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class MyCurriculumnItemRepository
  extends BaseRepository<MyCurriculumnItem>
  implements IMyCurriculumnItemRepository<MyCurriculumnItem>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(MyCurriculumnItem));
  }
}
