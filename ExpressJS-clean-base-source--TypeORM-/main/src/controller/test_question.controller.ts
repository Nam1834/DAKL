import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { TestQuestion } from '@/models/test_question.model';
import { ITestQuestionService } from '@/service/interface/i.test_question.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class TestQuestionController {
  public common: IBaseCrudController<TestQuestion>;
  private testQuestionService: ITestQuestionService<TestQuestion>;
  constructor(
    @inject('TestQuestionService') testQuestionService: ITestQuestionService<TestQuestion>,
    @inject(ITYPES.Controller) common: IBaseCrudController<TestQuestion>
  ) {
    this.testQuestionService = testQuestionService;
    this.common = common;
  }
}
