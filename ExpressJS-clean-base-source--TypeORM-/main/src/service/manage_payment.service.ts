import { RevenuePagingResponseDto } from '@/dto/paging-response-revenue.dto';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ManagePayment } from '@/models/manage_payment.model';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IManagePaymentService } from '@/service/interface/i.manage_payment.service';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class ManagePaymentService
  extends BaseCrudService<ManagePayment>
  implements IManagePaymentService<ManagePayment>
{
  private managePaymentRepository: IManagePaymentRepository<ManagePayment>;

  constructor(@inject('ManagePaymentRepository') managePaymentRepository: IManagePaymentRepository<ManagePayment>) {
    super(managePaymentRepository);
    this.managePaymentRepository = managePaymentRepository;
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
}
