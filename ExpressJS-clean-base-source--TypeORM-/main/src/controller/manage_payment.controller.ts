import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ManagePayment } from '@/models/manage_payment.model';
import { IManagePaymentService } from '@/service/interface/i.manage_payment.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ManagePaymentController {
  public common: IBaseCrudController<ManagePayment>;
  private managePaymentService: IManagePaymentService<ManagePayment>;
  constructor(
    @inject('ManagePaymentService') managePaymentService: IManagePaymentService<ManagePayment>,
    @inject(ITYPES.Controller) common: IBaseCrudController<ManagePayment>
  ) {
    this.managePaymentService = managePaymentService;
    this.common = common;
  }

  async searchManagePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.managePaymentService.search(searchData);
      res.send_ok('Manage Payment fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async searchManagePaymentForTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const tutor = req.user;
      if (!tutor) {
        throw new Error('You must login');
      }
      const tutorId = tutor.id;
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.managePaymentService.searchForTutor(tutorId, searchData);
      res.send_ok('Manage Payment fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
  async searchManagePaymentWithTime(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      searchData.periodType = req.query.periodType as any;
      searchData.periodValue = req.query.periodValue ? Number(req.query.periodValue) : undefined;

      const result = await this.managePaymentService.searchWithTime(searchData);
      res.send_ok('Manage Payment with time fetch successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async searchWithTimeForTutorRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      searchData.periodType = req.query.periodType as any;
      searchData.periodValue = req.query.periodValue ? Number(req.query.periodValue) : undefined;

      const result = await this.managePaymentService.searchWithTimeForTutorRevenue(searchData);
      res.send_ok('Manage Payment with time fetch successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
