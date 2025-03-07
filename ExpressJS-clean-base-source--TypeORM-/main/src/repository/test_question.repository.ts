import { TestQuestion } from '@/models/test_question.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ITestQuestionRepository } from '@/repository/interface/i.test_question.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class TestQuestionRepository
  extends BaseRepository<TestQuestion>
  implements ITestQuestionRepository<TestQuestion>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(TestQuestion));
  }
}
