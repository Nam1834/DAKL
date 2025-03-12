import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { CreateSubjectReq } from '@/dto/subject/create-subject.req';
import { Subject } from '@/models/subject.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ISubjectService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<Subject>>;
  createSubject(data: CreateSubjectReq): Promise<void>;
  updateSubject(id: string, data: any): Promise<void>;
}
