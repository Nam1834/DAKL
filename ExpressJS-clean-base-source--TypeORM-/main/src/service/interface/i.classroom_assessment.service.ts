import { CreateAssessmentReq } from '@/dto/assessment/create-assessment.req';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IClassroomAssessmentService<T extends BaseModelType> extends IBaseCrudService<T> {
  createAssessment(userId: string, classroomId: string, data: CreateAssessmentReq): Promise<void>;
}
