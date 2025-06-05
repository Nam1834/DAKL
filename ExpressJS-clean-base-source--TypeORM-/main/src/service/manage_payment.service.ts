import { RevenuePagingResponseDto } from '@/dto/paging-response-revenue.dto';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ManagePayment } from '@/models/manage_payment.model';
import { TutorProfile } from '@/models/tutor_profile.model';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IManagePaymentService } from '@/service/interface/i.manage_payment.service';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';
import { filter } from 'lodash';
import { Between, In } from 'typeorm';

@injectable()
export class ManagePaymentService
  extends BaseCrudService<ManagePayment>
  implements IManagePaymentService<ManagePayment>
{
  private managePaymentRepository: IManagePaymentRepository<ManagePayment>;
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;

  constructor(
    @inject('ManagePaymentRepository') managePaymentRepository: IManagePaymentRepository<ManagePayment>,
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>
  ) {
    super(managePaymentRepository);
    this.managePaymentRepository = managePaymentRepository;
    this.tutorProfileRepository = tutorProfileRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<ManagePayment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const payments = await this.managePaymentRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.managePaymentRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, payments);
  }

  async searchForTutor(tutorId: string, searchData: SearchDataDto): Promise<RevenuePagingResponseDto<ManagePayment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const payments = await this.managePaymentRepository.findMany({
      filter: { tutorId: tutorId, ...where },
      order: order,
      paging: paging
    });

    const total = await this.managePaymentRepository.count({
      filter: where
    });

    // Tong doanh thu
    const totalRevenue = await this.managePaymentRepository.sum('coinOfTutorReceive', {
      tutorId,
      ...where
    });

    return new RevenuePagingResponseDto(total, payments, totalRevenue);
  }

  async searchWithTime(searchData: SearchDataDto): Promise<RevenuePagingResponseDto<TutorProfile>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const paymentTimeFilter: any = {};
    if (searchData.periodType) {
      const now = new Date();
      const timeStart = new Date(now);

      switch (searchData.periodType) {
        case 'DAY':
          timeStart.setDate(now.getDate() - (searchData.periodValue ?? 1));
          break;
        case 'WEEK':
          timeStart.setDate(now.getDate() - 7 * (searchData.periodValue ?? 1));
          break;
        case 'MONTH':
          timeStart.setMonth(now.getMonth() - (searchData.periodValue ?? 1));
          break;
        case 'YEAR':
          timeStart.setFullYear(now.getFullYear() - (searchData.periodValue ?? 1));
          break;
      }
      Object.assign(where, {
        createdAt: Between(timeStart, now)
      });
    }

    // Lấy danh sách tutorProfile theo filter
    const tutorProfiles = await this.tutorProfileRepository.findMany({
      filter: where,
      paging: paging,
      order: order
    });

    // Lấy tutorIds
    const tutorIds = tutorProfiles.map((tutor) => tutor.userId);

    if (tutorIds.length === 0) {
      // Trường hợp không có tutor nào thỏa filter thì trả về mặc định
      return new RevenuePagingResponseDto(0, [], 0);
    }

    // Truy vấn managePayment theo tutorIds và filter thời gian
    const paymentFilter = {
      tutorId: { $in: tutorIds },
      ...paymentTimeFilter
    };

    const payments = await this.managePaymentRepository.findMany({
      filter: paymentFilter,
      order
    });

    // Tính tổng số lần thanh toán và tổng coin theo tutorId
    const paymentStatsMap = new Map<string, { totalPayments: number; totalCoins: number }>();

    payments.forEach((payment) => {
      const tutorId = payment.tutorId;
      const stats = paymentStatsMap.get(tutorId) || { totalPayments: 0, totalCoins: 0 };
      stats.totalPayments += 1;
      stats.totalCoins += payment.coinOfTutorReceive || 0;
      paymentStatsMap.set(tutorId, stats);
    });

    // Gắn tổng thanh toán và tổng coin vào tutorProfiles
    tutorProfiles.forEach((profile) => {
      const stats = paymentStatsMap.get(profile.userId);
      (profile as any).totalPaymentCount = stats?.totalPayments || 0;
      (profile as any).totalCoinReceived = stats?.totalCoins || 0;
    });

    // Tính tổng doanh thu (totalRevenue) trên tất cả payments
    const totalRevenue = payments.reduce((sum, p) => sum + (p.coinOfTutorReceive || 0), 0);

    // Tổng số bản ghi tutorProfiles (nếu cần, hoặc dùng count riêng)
    const total = await this.tutorProfileRepository.count({});

    return new RevenuePagingResponseDto(total, tutorProfiles, totalRevenue);
  }
}
