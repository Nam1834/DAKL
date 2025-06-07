import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IClassroomAssessmentRepository } from '@/repository/interface/i.classroom_assessment.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ClassroomAssessmentRepository
  extends BaseRepository<ClassroomAssessment>
  implements IClassroomAssessmentRepository<ClassroomAssessment>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ClassroomAssessment));
  }

  async countWithFilter(filter: Record<string, any>): Promise<number> {
    return await this.ormRepository.count({
      where: filter
    });
  }

  async findClassroomAssessmentsByTutorIds(
    tutorIds: string[],
    timeStart: Date,
    timeEnd: Date
  ): Promise<ClassroomAssessment[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder('assessment');

    queryBuilder.where('assessment.createdAt BETWEEN :start AND :end', {
      start: timeStart,
      end: timeEnd
    });

    // Thêm điều kiện OR từng tutorId
    tutorIds.forEach((id, index) => {
      if (index === 0) {
        queryBuilder.andWhere('(assessment.tutorId = :id0', { [`id0`]: id });
      } else {
        queryBuilder.orWhere(`assessment.tutorId = :id${index}`, { [`id${index}`]: id });
      }
    });

    if (tutorIds.length > 0) {
      queryBuilder.andWhere('1=1)'); // đóng ngoặc
    }

    return await queryBuilder.getMany();
  }
}
