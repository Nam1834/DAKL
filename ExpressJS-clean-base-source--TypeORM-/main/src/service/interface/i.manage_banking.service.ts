import { CreateManageBankingReq } from '@/dto/manage-banking/create-manage-banking.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ManageBanking } from '@/models/manage_banking.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IManageBankingService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<ManageBanking>>;
  getMyManageBanking(tutorId: string, searchData: SearchDataDto): Promise<PagingResponseDto<ManageBanking>>;
  createManageBanking(tutorId: string, data: CreateManageBankingReq): Promise<void>;
  solveManageBanking(click: string, manageBankingId: string): Promise<void>;
}
