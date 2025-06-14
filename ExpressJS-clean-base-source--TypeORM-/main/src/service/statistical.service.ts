import { StatisticalRevenueRes } from '@/dto/statistical/statistical-revenue.res';
import { StatisticalRes } from '@/dto/statistical/statistical.res';
import { IStatisticalRepository } from '@/repository/interface/i.statistical.repository';
import { StatisticalRepository } from '@/repository/statistical.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IStatisticalService } from '@/service/interface/i.statistical.service';
import { inject, injectable } from 'inversify';
import * as ExcelJS from 'exceljs';
import { Buffer } from 'node:buffer';
import * as fs from 'fs';
import * as path from 'path';

@injectable()
export class StatisticalService implements IStatisticalService {
  private statisticalRepository: StatisticalRepository;

  constructor(@inject('StatisticalRepository') statisticalRepository: StatisticalRepository) {
    this.statisticalRepository = statisticalRepository;
  }

  async getStatistics(time: number): Promise<StatisticalRes> {
    const statistics = await this.statisticalRepository.getStatisticsBetweenDates(time);
    const result = new StatisticalRes({
      revenue: statistics.revenue,
      newUsers: statistics.newUsers,
      newTutors: statistics.newTutors,
      // newCourses: statistics.newCourses,
      // coursesPurchased: statistics.coursesPurchased,
      // courseRatings: statistics.courseRatings,
      // averageRating: statistics.averageRating,
      revenuePercentage: statistics.revenuePercentage,
      newUserPercentage: statistics.newUserPercentage,
      newTutorPercentage: statistics.newTutorPercentage,
      // newLecturerPercentage: statistics.newLecturerPercentage,
      // coursesPurchasedPercentage: statistics.coursesPurchasedPercentage,
      // courseRatingsPercentage: statistics.courseRatingsPercentage,
      // averageRatingPercentage: statistics.averageRatingPercentage
      newTutorRequest: statistics.newTutorRequest,
      newTutorRequestPercentage: statistics.newTutorRequestPercentage,
      newClassActive: statistics.newClassActive,
      newClassActivePercentage: statistics.newClassActivePercentage,
      classroomRating: statistics.classroomRating,
      classroomRatingPercentage: statistics.classroomRatingPercentage,
      totalManagePayment: statistics.totalManagePayment,
      totalManagePaymentPercentage: statistics.totalManagePaymentPercentage
    });
    return result;
  }
  async getDailyRevenue(): Promise<StatisticalRevenueRes> {
    const dailyRevenue = await this.statisticalRepository.getDailyRevenue();
    const result = new StatisticalRevenueRes({ revenue: dailyRevenue });
    return result;
  }
  async getWeekRevenue(): Promise<StatisticalRevenueRes> {
    const weekRevenue = await this.statisticalRepository.getWeeksRevenue();
    const result = new StatisticalRevenueRes({ revenue: weekRevenue });
    return result;
  }
  async getMonthRevenue(): Promise<StatisticalRevenueRes> {
    const monthRevenue = await this.statisticalRepository.getMonthsRevenue();
    const result = new StatisticalRevenueRes({ revenue: monthRevenue });
    return result;
  }
  async exportStatisticsToExcel(time: number): Promise<Buffer> {
    const information = await this.getStatistics(time);

    let dailyRevenue = null;
    if (time === 7) {
      dailyRevenue = await this.getDailyRevenue();
    } else if (time === 30) {
      dailyRevenue = await this.getWeekRevenue();
    } else {
      dailyRevenue = await this.getMonthRevenue();
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Tổng Quan');

    sheet.addRow(['Chỉ số', 'Giá trị']);
    sheet.addRows([
      ['Doanh thu', information.revenue],
      ['Người dùng mới', information.newUsers],
      ['Gia sư mới', information.newTutors],
      ['% Tăng trưởng doanh thu', `${information.revenuePercentage?.toFixed(2)}%`],
      ['% Tăng trưởng người dùng', `${information.newUserPercentage?.toFixed(2)}%`],
      ['% Tăng trưởng gia sư', `${information.newTutorPercentage?.toFixed(2)}%`],
      ['Yêu cầu gia sư mới', information.newTutorRequest],
      ['% Tăng trưởng yêu cầu gia sư', `${information.newTutorRequestPercentage?.toFixed(2)}%`],
      ['Lớp học mới', information.newClassActive],
      ['% Tăng trưởng lớp học', `${information.newClassActivePercentage?.toFixed(2)}%`],
      ['Đánh giá lớp học', information.classroomRating],
      ['% Tăng trưởng đánh giá lớp học', `${information.classroomRatingPercentage?.toFixed(2)}%`]
    ]);

    const revenueSheet = workbook.addWorksheet('Doanh Thu');
    revenueSheet.addRow(['Ngày', 'Doanh thu']);

    for (const entry of dailyRevenue.revenue) {
      revenueSheet.addRow([entry.date, entry.revenue]);
    }

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }
}
