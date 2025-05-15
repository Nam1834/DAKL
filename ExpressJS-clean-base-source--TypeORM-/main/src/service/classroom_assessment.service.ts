import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { IClassroomAssessmentRepository } from '@/repository/interface/i.classroom_assessment.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IClassroomAssessmentService } from '@/service/interface/i.classroom_assessment.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ClassroomAssessmentService
  extends BaseCrudService<ClassroomAssessment>
  implements IClassroomAssessmentService<ClassroomAssessment>
{
  private classroomAssessmentRepository: IClassroomAssessmentRepository<ClassroomAssessment>;

  constructor(
    @inject('ClassroomAssessmentRepository')
    classroomAssessmentRepository: IClassroomAssessmentRepository<ClassroomAssessment>
  ) {
    super(classroomAssessmentRepository);
    this.classroomAssessmentRepository = classroomAssessmentRepository;
  }

  async search(): Promise<void> {}

  async createAssessment(userId: string, tutorId: string): Promise<void> {}
}
