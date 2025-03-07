import { TestController } from '@/controller/test.controller';
import { TestService } from '@/service/test.service';
import { Test } from '@/models/test.model';
import { TestRepository } from '@/repository/test.repository';
import { ITestService } from '@/service/interface/i.test.service';
import { ITestRepository } from '@/repository/interface/i.test.repository';
import { BaseContainer } from '@/container/base.container';

class TestContainer extends BaseContainer {
  constructor() {
    super(Test);
    this.container.bind<ITestService<Test>>('TestService').to(TestService);
    this.container.bind<ITestRepository<Test>>('TestRepository').to(TestRepository);
    this.container.bind<TestController>(TestController).toSelf();
  }

  export() {
    const testController = this.container.get<TestController>(TestController);
    const testService = this.container.get<ITestService<any>>('TestService');
    const testRepository = this.container.get<ITestRepository<any>>('TestRepository');

    return { testController, testService, testRepository };
  }
}

const testContainer = new TestContainer();
const { testController, testService, testRepository } = testContainer.export();
export { testController, testService, testRepository };
