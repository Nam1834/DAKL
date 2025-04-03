import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { CreateTutorLevelReq } from '@/dto/tutor-level/create-tutor-level.req';
import { TutorLevel } from '@/models/tutor_level.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ITutorLevelService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<TutorLevel>>;
  createTutorLevel(data: CreateTutorLevelReq): Promise<void>;
  updateTutorLevel(id: string, data: any): Promise<void>;
  deleteTutorLevelById(id: string): Promise<void>;
}
