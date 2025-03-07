import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
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
}
