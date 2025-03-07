import { TestResult } from '@/models/test_result.model';
import { ITestResultRepository } from '@/repository/interface/i.test_result.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITestResultService } from '@/service/interface/i.test_result.service';
import { inject, injectable } from 'inversify';

@injectable()
export class TestResultService extends BaseCrudService<TestResult> implements ITestResultService<TestResult> {
  private testResultRepository: ITestResultRepository<TestResult>;

  constructor(@inject('TestResultRepository') testResultRepository: ITestResultRepository<TestResult>) {
    super(testResultRepository);
    this.testResultRepository = testResultRepository;
  }
}
