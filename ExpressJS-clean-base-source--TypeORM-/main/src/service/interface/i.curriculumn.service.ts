import { GetListCurriculumnRes } from '@/dto/curriculumn/get-list-curriculumn.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ICurriculumnService<T extends BaseModelType> extends IBaseCrudService<T> {
  getList(paging: PagingDto): Promise<PagingResponseDto<GetListCurriculumnRes>>;
}
