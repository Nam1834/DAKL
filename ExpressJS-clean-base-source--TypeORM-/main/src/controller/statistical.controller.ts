import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { IStatisticalService } from '@/service/interface/i.statistical.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class StatisticalController {
  private statisticalService: IStatisticalService;
  constructor(@inject('StatisticalService') statisticalService: IStatisticalService) {
    this.statisticalService = statisticalService;
  }

  async getWeekStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const dailyRevenue = await this.statisticalService.getDailyRevenue();
      const information = await this.statisticalService.getStatistics(7);
      res.send_ok('Get statistics successfully', { dailyRevenue, information });
    } catch (error) {
      next(error);
    }
  }
  async getMonthStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const weekRevenue = await this.statisticalService.getWeekRevenue();
      const information = await this.statisticalService.getStatistics(30);
      res.send_ok('Get statistics successfully', { weekRevenue, information });
    } catch (error) {
      next(error);
    }
  }
  async getYearStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const monthRevenue = await this.statisticalService.getMonthRevenue();
      const information = await this.statisticalService.getStatistics(365);
      res.send_ok('Get statistics successfully', { monthRevenue, information });
    } catch (error) {
      next(error);
    }
  }
  async exportWeekStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const buffer = await this.statisticalService.exportStatisticsToExcel(7);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=week_statistics.xlsx');
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async exportMonthStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const buffer = await this.statisticalService.exportStatisticsToExcel(30);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=month_statistics.xlsx');
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async exportYearStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const buffer = await this.statisticalService.exportStatisticsToExcel(365);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=year_statistics.xlsx');
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }
}
