import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IClassroomAssessmentRepository<T> extends IBaseRepository<T> {
  countWithFilter(filter: Record<string, any>): Promise<number>;
  findClassroomAssessmentsByTutorIds(
    tutorIds: string[],
    timeStart: Date,
    timeEnd: Date
  ): Promise<ClassroomAssessment[]>;
  findAssessmentsByClassroomAndMeetingIds(classroomId: string, meetingIds: string[]): Promise<ClassroomAssessment[]>;
  avg(field: keyof ClassroomAssessment, filter: any): Promise<number | null>;
}
