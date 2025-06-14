import { CreateAssessmentReq } from '@/dto/assessment/create-assessment.req';
import { AssessmentPagingResponseDto } from '@/dto/paging-response-assessment.dto';
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
import { Between, MoreThanOrEqual } from 'typeorm';

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
      relations: ['user', 'tutor', 'classroom'],
      paging: paging
    });

    const total = await this.classroomAssessmentRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, assessments);
  }

  async searchWithTime(searchData: SearchDataDto): Promise<PagingResponseDto<TutorProfile>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const tutors = await this.tutorProfileRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.tutorProfileRepository.count({
      filter: where
    });

    const tutorIds = tutors.map((t) => t.userId);

    let classroomAssessments: ClassroomAssessment[] = [];

    let timeStart: Date | null = null;
    let timeEnd: Date | null = null;

    // Ưu tiên startDate và endDate nếu được truyền vào
    if (searchData.startDate && searchData.endDate) {
      if (typeof searchData.startDate === 'string' && typeof searchData.endDate === 'string') {
        const [startDay, startMonth, startYear] = searchData.startDate.split('/').map(Number);
        const [endDay, endMonth, endYear] = searchData.endDate.split('/').map(Number);

        timeStart = new Date(startYear, startMonth - 1, startDay);
        timeEnd = new Date(endYear, endMonth - 1, endDay + 1); // Bao gồm cả ngày kết thúc
      } else {
        timeStart = new Date(searchData.startDate);
        timeEnd = new Date(searchData.endDate);
        timeEnd.setDate(timeEnd.getDate() + 1);
      }
    } else if (searchData.periodType) {
      timeEnd = new Date();
      timeStart = new Date(timeEnd);

      switch (searchData.periodType) {
        case 'DAY':
          timeStart.setDate(timeEnd.getDate() - (searchData.periodValue ?? 1));
          break;
        case 'WEEK':
          timeStart.setDate(timeEnd.getDate() - 7 * (searchData.periodValue ?? 1));
          break;
        case 'MONTH':
          timeStart.setMonth(timeEnd.getMonth() - (searchData.periodValue ?? 1));
          break;
        case 'YEAR':
          timeStart.setFullYear(timeEnd.getFullYear() - (searchData.periodValue ?? 1));
          break;
      }
    }

    if (timeStart && timeEnd) {
      Object.assign(where, {
        createdAt: Between(timeStart, timeEnd)
      });

      classroomAssessments = await this.classroomAssessmentRepository.findClassroomAssessmentsByTutorIds(
        tutorIds,
        timeStart,
        timeEnd
      );
    }

    // Tính số lượt đánh giá và tổng điểm
    const assessmentCountMap = new Map<string, number>();
    const assessmentSumMap = new Map<string, number>();

    classroomAssessments.forEach((assessment) => {
      const tutorId = assessment.tutorId;
      const currentCount = assessmentCountMap.get(tutorId) || 0;
      const currentSum = assessmentSumMap.get(tutorId) || 0;

      assessmentCountMap.set(tutorId, currentCount + 1);

      if (assessment.classroomEvaluation !== null && assessment.classroomEvaluation !== undefined) {
        assessmentSumMap.set(tutorId, currentSum + Number(assessment.classroomEvaluation));
      }
    });

    // Gắn vào từng tutor
    tutors.forEach((tutor) => {
      const count = assessmentCountMap.get(tutor.userId) || 0;
      const sum = assessmentSumMap.get(tutor.userId) || 0;

      (tutor as any).totalAssessmentWithTime = count;
      (tutor as any).averageAssessmentWithTime = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;
    });

    return new PagingResponseDto(total, tutors);
  }

  async searchWithTimeForTutor(
    tutorId: string,
    searchData: SearchDataDto
  ): Promise<AssessmentPagingResponseDto<ClassroomAssessment>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    if (searchData.startDate && searchData.endDate) {
      Object.assign(where, {
        createdAt: Between(new Date(searchData.startDate), new Date(searchData.endDate))
      });
    } else if (searchData.periodType) {
      const now = new Date();
      const timeStart = new Date(now);

      switch (searchData.periodType) {
        case 'DAY':
          timeStart.setDate(now.getDate() - (searchData.periodValue ?? 1));
          break;
        case 'WEEK':
          timeStart.setDate(now.getDate() - 7 * (searchData.periodValue ?? 1));
          break;
        case 'MONTH':
          timeStart.setMonth(now.getMonth() - (searchData.periodValue ?? 1));
          break;
        case 'YEAR':
          timeStart.setFullYear(now.getFullYear() - (searchData.periodValue ?? 1));
          break;
      }
      Object.assign(where, {
        createdAt: Between(timeStart, now)
      });
    }

    const classroomAssessments = await this.classroomAssessmentRepository.findMany({
      filter: { tutorId: tutorId, ...where },
      order: order,
      paging: paging
    });

    const total = await this.classroomAssessmentRepository.count({
      filter: { tutorId: tutorId, ...where }
    });

    const averageRatingWithTime = await this.classroomAssessmentRepository.avg('classroomEvaluation', {
      tutorId: tutorId,
      ...where
    });

    return new AssessmentPagingResponseDto(total, classroomAssessments, averageRatingWithTime);
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
    classroomAssessment.meetingId = data.meetingId;
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

    // 2. Tính classroomEvaluation cho classroomId
    const classroomAssessments = await this.classroomAssessmentRepository.findMany({
      filter: { classroomId: classroomId }
    });

    const totalClassroomRating = classroomAssessments.reduce((sum, assessment) => {
      const score = Number(assessment.classroomEvaluation) || 0;
      return sum + score;
    }, 0);

    const classroomAvgRating =
      classroomAssessments.length > 0 ? Math.round((totalClassroomRating / classroomAssessments.length) * 10) / 10 : 0;

    await this.classroomRespository.findOneAndUpdate({
      filter: { classroomId: classroomId },
      updateData: {
        classroomEvaluation: classroomAvgRating
      }
    });
  }
}
