import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Test } from '@/models/test.model';
import { ITestService } from '@/service/interface/i.test.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class TestController {
  public common: IBaseCrudController<Test>;
  private testService: ITestService<Test>;
  constructor(
    @inject('TestService') testService: ITestService<Test>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Test>
  ) {
    this.testService = testService;
    this.common = common;
  }

  async searchTest(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.testService.search(searchData);
      res.send_ok('Test fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
