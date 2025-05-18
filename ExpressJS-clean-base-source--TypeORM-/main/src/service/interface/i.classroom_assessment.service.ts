import { CreateAssessmentReq } from '@/dto/assessment/create-assessment.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IClassroomAssessmentService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<ClassroomAssessment>>;
  createAssessment(userId: string, classroomId: string, data: CreateAssessmentReq): Promise<void>;
}
