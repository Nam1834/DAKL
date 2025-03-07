import { TestQuestionController } from '@/controller/test_question.controller';
import { TestQuestionService } from '@/service/test_question.service';
import { TestQuestion } from '@/models/test_question.model';
import { TestQuestionRepository } from '@/repository/test_question.repository';
import { ITestQuestionService } from '@/service/interface/i.test_question.service';
import { ITestQuestionRepository } from '@/repository/interface/i.test_question.repository';
import { BaseContainer } from '@/container/base.container';

class TestQuestionContainer extends BaseContainer {
  constructor() {
    super(TestQuestion);
    this.container.bind<ITestQuestionService<TestQuestion>>('TestQuestionService').to(TestQuestionService);
    this.container.bind<ITestQuestionRepository<TestQuestion>>('TestQuestionRepository').to(TestQuestionRepository);
    this.container.bind<TestQuestionController>(TestQuestionController).toSelf();
  }

  export() {
    const testQuestionController = this.container.get<TestQuestionController>(TestQuestionController);
    const testQuestionService = this.container.get<ITestQuestionService<any>>('TestQuestionService');
    const testQuestionRepository = this.container.get<ITestQuestionRepository<any>>('TestQuestionRepository');

    return { testQuestionController, testQuestionService, testQuestionRepository };
  }
}

const testQuestionContainer = new TestQuestionContainer();
const { testQuestionController, testQuestionService, testQuestionRepository } = testQuestionContainer.export();
export { testQuestionController, testQuestionService, testQuestionRepository };
