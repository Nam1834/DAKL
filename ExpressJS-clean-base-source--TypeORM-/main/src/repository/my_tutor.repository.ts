import { MyTutor } from '@/models/my_tutor.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IMyTutorRepository } from '@/repository/interface/i.my_tutor.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class MyTutorRepository extends BaseRepository<MyTutor> implements IMyTutorRepository<MyTutor> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(MyTutor));
  }
}
