import { GetListMajorRes } from '@/dto/major/get-list-major.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMajorService<T extends BaseModelType> extends IBaseCrudService<T> {
  updateMajor(id: string, data: any): Promise<void>;
  getList(paging: PagingDto): Promise<PagingResponseDto<GetListMajorRes>>;
}
