import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ManageBanking } from '@/models/manage_banking.model';
import { IManageBankingService } from '@/service/interface/i.manage_banking.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ManageBankingController {
  public common: IBaseCrudController<ManageBanking>;
  private manageBankingService: IManageBankingService<ManageBanking>;
  constructor(
    @inject('ManageBankingService') manageBankingService: IManageBankingService<ManageBanking>,
    @inject(ITYPES.Controller) common: IBaseCrudController<ManageBanking>
  ) {
    this.manageBankingService = manageBankingService;
    this.common = common;
  }

  async searchManageBanking(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.manageBankingService.search(searchData);
      res.send_ok('Manage Banking fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getMyManageBanking(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const tutorId = user?.id;

      if (!tutorId) {
        throw new Error('You must login');
      }
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.manageBankingService.getMyManageBanking(tutorId, searchData);
      res.send_ok('Manage Banking fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async createManageBanking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const tutorId = user?.id;

      if (!tutorId) {
        throw new Error('You must login');
      }
      const coinWithdraw = req.body;

      const result = await this.manageBankingService.createManageBanking(tutorId, coinWithdraw);

      res.send_ok('Create manage banking successfully', result);
    } catch (error) {
      next(error);
    }
  }
  async solveManageBanking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { click, manageBankingId } = req.body;

      const result = await this.manageBankingService.solveManageBanking(click, manageBankingId);

      res.send_ok('Solve manage banking successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
