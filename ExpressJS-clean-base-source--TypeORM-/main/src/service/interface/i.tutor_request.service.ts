import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { CancelRequestReq } from '@/dto/tutor/cancel-request.req';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { UpdateTutorProfileReq } from '@/dto/tutor/update-tutor-profile.req';
import { TutorRequest } from '@/models/tutor_request.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ITutorRequestService<T extends BaseModelType> extends IBaseCrudService<T> {
  getMyNewestRequest(userId: string): Promise<TutorRequest>;
  search(searchData: SearchDataDto): Promise<PagingResponseDto<TutorRequest>>;
  getMyListRequest(userId: string, searchData: SearchDataDto): Promise<PagingResponseDto<TutorRequest>>;
  regisToTutor(id: string, data: RegisToTutorReq): Promise<void>;
  updateTutorProfile(id: string, data: UpdateTutorProfileReq): Promise<void>;
  solveRequest(tutorRequestId: string, click: string, tutorLevelId: string): Promise<void>;
  cancelRequest(tutorRequestId: string, data: CancelRequestReq): Promise<void>;
}
