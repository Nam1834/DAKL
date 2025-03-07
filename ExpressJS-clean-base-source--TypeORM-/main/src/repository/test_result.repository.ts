import { TestResult } from '@/models/test_result.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ITestResultRepository } from '@/repository/interface/i.test_result.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class TestResultRepository extends BaseRepository<TestResult> implements ITestResultRepository<TestResult> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(TestResult));
  }
}
