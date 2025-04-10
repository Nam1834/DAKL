import { CreateCurriculumnReq } from '@/dto/curriculumn/create-curriculumn.req';
import { GetListCurriculumnRes } from '@/dto/curriculumn/get-list-curriculumn.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Curriculumn } from '@/models/curriculumn.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ICurriculumnService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<Curriculumn>>;
  createByAdmin(data: CreateCurriculumnReq, adminId: string): Promise<void>;
  getList(paging: PagingDto): Promise<PagingResponseDto<GetListCurriculumnRes>>;
}
