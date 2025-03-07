import { TestQuestion } from '@/models/test_question.model';
import { ITestQuestionRepository } from '@/repository/interface/i.test_question.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITestQuestionService } from '@/service/interface/i.test_question.service';
import { inject, injectable } from 'inversify';

@injectable()
export class TestQuestionService extends BaseCrudService<TestQuestion> implements ITestQuestionService<TestQuestion> {
  private testQuestionRepository: ITestQuestionRepository<TestQuestion>;

  constructor(@inject('TestQuestionRepository') testQuestionRepository: ITestQuestionRepository<TestQuestion>) {
    super(testQuestionRepository);
    this.testQuestionRepository = testQuestionRepository;
  }
}
