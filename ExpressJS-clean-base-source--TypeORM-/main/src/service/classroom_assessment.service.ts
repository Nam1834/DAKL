import { CreateAssessmentReq } from '@/dto/assessment/create-assessment.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Classroom } from '@/models/classroom.model';
import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { TutorProfile } from '@/models/tutor_profile.model';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { IClassroomAssessmentRepository } from '@/repository/interface/i.classroom_assessment.repository';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IClassroomAssessmentService } from '@/service/interface/i.classroom_assessment.service';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class ClassroomAssessmentService
  extends BaseCrudService<ClassroomAssessment>
  implements IClassroomAssessmentService<ClassroomAssessment>
{
  private classroomAssessmentRepository: IClassroomAssessmentRepository<ClassroomAssessment>;
  private classroomRespository: IClassroomRepository<Classroom>;
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;

  constructor(
    @inject('ClassroomAssessmentRepository')
    classroomAssessmentRepository: IClassroomAssessmentRepository<ClassroomAssessment>,
    @inject('ClassroomRepository') classroomRespository: IClassroomRepository<Classroom>,
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>
  ) {
    super(classroomAssessmentRepository);
    this.classroomAssessmentRepository = classroomAssessmentRepository;
    this.classroomRespository = classroomRespository;
    this.tutorProfileRepository = tutorProfileRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<ClassroomAssessment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const assessments = await this.classroomAssessmentRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.classroomAssessmentRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, assessments);
  }

  async createAssessment(userId: string, classroomId: string, data: CreateAssessmentReq): Promise<void> {
    const classroom = await this.classroomRespository.findOne({
      filter: { classroomId: classroomId }
    });

    if (!classroom) {
      throw new Error('Classroom does not exist!');
    }

    const classroomAssessment = new ClassroomAssessment();
    classroomAssessment.userId = userId;
    classroomAssessment.tutorId = data.tutorId;
    classroomAssessment.classroomId = classroomId;
    classroomAssessment.classroomEvaluation = data.classroomEvaluation;
    classroomAssessment.description = data.description;

    await this.classroomAssessmentRepository.create({
      data: classroomAssessment
    });

    //logic neu gia su trong lop hoc
    const assessments = await this.classroomAssessmentRepository.findMany({
      filter: { tutorId: data.tutorId }
    });

    const numberOfRating = assessments.length;
    const totalRating = assessments.reduce((sum, assessment) => {
      const score = Number(assessment.classroomEvaluation) || 0;
      return sum + score;
    }, 0);

    const avgRating = numberOfRating > 0 ? Math.round((totalRating / numberOfRating) * 10) / 10 : 0;
    // 3. Cập nhật TutorProfile
    await this.tutorProfileRepository.findOneAndUpdate({
      filter: { userId: data.tutorId },
      updateData: {
        numberOfRating: numberOfRating,
        rating: avgRating
      }
    });
  }
}
