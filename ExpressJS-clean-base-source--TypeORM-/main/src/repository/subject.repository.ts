import { Subject } from '@/models/subject.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ISubjectRepository } from '@/repository/interface/i.subject.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class SubjectRepository extends BaseRepository<Subject> implements ISubjectRepository<Subject> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Subject));
  }
}
