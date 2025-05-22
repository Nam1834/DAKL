import { statisticalController } from '@/container/statistical.container';
import express from 'express';
const statisticalRouter = express.Router();

statisticalRouter
  .get('/week', statisticalController.getWeekStatistic.bind(statisticalController))

  .get('/month', statisticalController.getMonthStatistic.bind(statisticalController))

  .get('/year', statisticalController.getYearStatistic.bind(statisticalController))

  .get('/export/week', statisticalController.exportWeekStatistic.bind(statisticalController))

  .get('/export/month', statisticalController.exportMonthStatistic.bind(statisticalController))

  .get('/export/year', statisticalController.exportYearStatistic.bind(statisticalController));
export default statisticalRouter;
