import { StatisticalRevenueRes } from '@/dto/statistical/statistical-revenue.res';
import { StatisticalRes } from '@/dto/statistical/statistical.res';
import { IStatisticalRepository } from '@/repository/interface/i.statistical.repository';
import { StatisticalRepository } from '@/repository/statistical.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IStatisticalService } from '@/service/interface/i.statistical.service';
import { inject, injectable } from 'inversify';

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
      classroomRatingPercentage: statistics.classroomRatingPercentage
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
}
