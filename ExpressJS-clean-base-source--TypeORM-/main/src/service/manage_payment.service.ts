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

  async searchWithTime(searchData: SearchDataDto): Promise<RevenuePagingResponseDto<ManagePayment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

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
    const managePayments = await this.managePaymentRepository.findMany({
      filter: where,
      paging: paging,
      relations: ['tutor'],
      order: order
    });

    const total = await this.managePaymentRepository.count({
      filter: where
    });

    const totalPayment = await this.managePaymentRepository.sum('coinOfTutorReceive', where);

    return new RevenuePagingResponseDto(total, managePayments, totalPayment);
  }
}
