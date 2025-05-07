import { Classroom } from '@/models/classroom.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ClassroomRepository extends BaseRepository<Classroom> implements IClassroomRepository<Classroom> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Classroom));
  }
}
