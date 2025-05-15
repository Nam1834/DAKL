import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Classroom } from '@/models/classroom.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IClassroomService<T extends BaseModelType> extends IBaseCrudService<T> {
  getListClassroomForUser(userId: string, searchData: SearchDataDto): Promise<PagingResponseDto<Classroom>>;
  getListClassroomForTutor(tutorId: string, searchData: SearchDataDto): Promise<PagingResponseDto<Classroom>>;
}
