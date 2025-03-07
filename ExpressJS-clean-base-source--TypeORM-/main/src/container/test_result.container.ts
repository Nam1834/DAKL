import { TestResultController } from '@/controller/test_result.controller';
import { TestResultService } from '@/service/test_result.service';
import { TestResult } from '@/models/test_result.model';
import { TestResultRepository } from '@/repository/test_result.repository';
import { ITestResultService } from '@/service/interface/i.test_result.service';
import { ITestResultRepository } from '@/repository/interface/i.test_result.repository';
import { BaseContainer } from '@/container/base.container';
import { ITestQuestionRepository } from '@/repository/interface/i.test_question.repository';
import { testQuestionRepository } from './test_question.container';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { userRepository } from './user.container';

class TestResultContainer extends BaseContainer {
  constructor() {
    super(TestResult);
    this.container.bind<ITestResultService<TestResult>>('TestResultService').to(TestResultService);
    this.container.bind<ITestResultRepository<TestResult>>('TestResultRepository').to(TestResultRepository);
    this.container.bind<TestResultController>(TestResultController).toSelf();

    //Import
    this.container.bind<ITestQuestionRepository<any>>('TestQuestionRepository').toConstantValue(testQuestionRepository);
    this.container.bind<IUserRepository<any>>('UserRepository').toConstantValue(userRepository);
  }

  export() {
    const testResultController = this.container.get<TestResultController>(TestResultController);
    const testResultService = this.container.get<ITestResultService<any>>('TestResultService');
    const testResultRepository = this.container.get<ITestResultRepository<any>>('TestResultRepository');

    return { testResultController, testResultService, testResultRepository };
  }
}

const testResultContainer = new TestResultContainer();
const { testResultController, testResultService, testResultRepository } = testResultContainer.export();
export { testResultController, testResultService, testResultRepository };
