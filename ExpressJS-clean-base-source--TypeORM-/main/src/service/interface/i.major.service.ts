import { CreateMajorReq } from '@/dto/major/create-major.req';
import { GetListMajorRes } from '@/dto/major/get-list-major.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Major } from '@/models/major.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMajorService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<Major>>;
  // searchAll(searchData: SearchDataDto): Promise<PagingResponseDto<Major>>;
  createMajor(data: CreateMajorReq): Promise<void>;
  updateMajor(id: string, data: any): Promise<void>;
  getList(paging: PagingDto): Promise<PagingResponseDto<GetListMajorRes>>;
}
