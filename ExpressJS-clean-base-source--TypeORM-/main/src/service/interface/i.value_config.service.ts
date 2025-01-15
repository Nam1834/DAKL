import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { GetListValueConfigRes } from '@/dto/value-config/get-list-value-config.res';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IValueConfigService<T extends BaseModelType> extends IBaseCrudService<T> {
  updateValueConfig(id: string, data: any): Promise<void>;
  getList(paging: PagingDto): Promise<PagingResponseDto<GetListValueConfigRes>>;
}
