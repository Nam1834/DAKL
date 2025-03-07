import { Test } from '@/models/test.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ITestRepository } from '@/repository/interface/i.test.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class TestRepository extends BaseRepository<Test> implements ITestRepository<Test> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Test));
  }
}
