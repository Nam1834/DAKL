import { MyTutorItem } from '@/models/my_tutor_item.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IMyTutorItemRepository } from '@/repository/interface/i.my_tutor_item.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class MyTutorItemRepository extends BaseRepository<MyTutorItem> implements IMyTutorItemRepository<MyTutorItem> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(MyTutorItem));
  }
}
