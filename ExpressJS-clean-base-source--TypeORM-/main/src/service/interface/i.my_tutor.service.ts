import { AddToMyTutorReq } from '@/dto/my-tutor/add-to-my-tutor.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { MyTutor } from '@/models/my_tutor.model';
import { MyTutorItem } from '@/models/my_tutor_item.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMyTutorService<T extends BaseModelType> extends IBaseCrudService<T> {
  getMyTutor(userId: string, searchData: SearchDataDto): Promise<PagingResponseDto<MyTutorItem>>;
  removeFromMyTutor(userId: string, tutorId: string): Promise<void>;
  addToMyTutor(userId: string, data: AddToMyTutorReq): Promise<void>;
}
