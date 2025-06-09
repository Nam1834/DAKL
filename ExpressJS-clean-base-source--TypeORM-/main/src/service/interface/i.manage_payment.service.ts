import { RevenuePagingResponseDto } from '@/dto/paging-response-revenue.dto';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ManagePayment } from '@/models/manage_payment.model';
import { TutorProfile } from '@/models/tutor_profile.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IManagePaymentService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<ManagePayment>>;
  searchForTutor(tutorId: string, searchData: SearchDataDto): Promise<RevenuePagingResponseDto<ManagePayment>>;
  searchWithTime(searchData: SearchDataDto): Promise<RevenuePagingResponseDto<ManagePayment>>;
  searchWithTimeForTutor(tutorId: string, searchData: SearchDataDto): Promise<RevenuePagingResponseDto<ManagePayment>>;
  searchWithTimeForTutorRevenue(searchData: SearchDataDto): Promise<PagingResponseDto<TutorProfile>>;
}
