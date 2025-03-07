import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SubmitTestDto } from '@/dto/test/submit-test.dto';
import { TestResult } from '@/models/test_result.model';
import { ITestResultService } from '@/service/interface/i.test_result.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class TestResultController {
  public common: IBaseCrudController<TestResult>;
  private testResultService: ITestResultService<TestResult>;
  constructor(
    @inject('TestResultService') testResultService: ITestResultService<TestResult>,
    @inject(ITYPES.Controller) common: IBaseCrudController<TestResult>
  ) {
    this.testResultService = testResultService;
    this.common = common;
  }

  async submitTest(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new Error('You must login');
      }
      const userId = user.id;

      const submitTestDto: SubmitTestDto = req.body;
      const result = await this.testResultService.submitTest(userId, submitTestDto);
      res.send_ok('Test submitted successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
