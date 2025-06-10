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

  async findAssessmentsByClassroomAndMeetingIds(
    classroomId: string,
    meetingIds: string[]
  ): Promise<ClassroomAssessment[]> {
    const queryBuilder = this.ormRepository.createQueryBuilder('assessment');

    queryBuilder
      .where('assessment.classroomId = :classroomId', { classroomId })
      .andWhere('assessment.meetingId IN (:...meetingIds)', { meetingIds });

    return await queryBuilder.getMany();
  }

  async avg(field: keyof ClassroomAssessment, filter: any): Promise<number | null> {
    const qb = this.ormRepository.createQueryBuilder('ca');
    qb.select(`AVG(ca.${field})`, 'avg');

    let paramIndex = 0;
    for (const key in filter) {
      const value = filter[key];

      if (value instanceof Object && value['@instanceof'] === Symbol.for('FindOperator')) {
        const operator = value['_type'];
        const paramName = `param${paramIndex++}`;

        switch (operator) {
          case 'isNull':
            qb.andWhere(`ca.${key} IS NULL`);
            break;
          case 'not':
            qb.andWhere(`ca.${key} != :${paramName}`, { [paramName]: value['_value'] });
            break;
          case 'like':
            qb.andWhere(`ca.${key} LIKE :${paramName}`, { [paramName]: value['_value'] });
            break;
          case 'equal':
            qb.andWhere(`ca.${key} = :${paramName}`, { [paramName]: value['_value'] });
            break;
          case 'between':
            qb.andWhere(`ca.${key} BETWEEN :${paramName}_start AND :${paramName}_end`, {
              [`${paramName}_start`]: value['_value'][0],
              [`${paramName}_end`]: value['_value'][1]
            });
            break;
          default:
            throw new Error(`Unsupported operator in avg(): ${operator}`);
        }
      } else {
        const paramName = `param${paramIndex++}`;
        qb.andWhere(`ca.${key} = :${paramName}`, { [paramName]: value });
      }
    }

    const result = await qb.getRawOne();
    return result?.avg !== undefined ? parseFloat(result.avg) : null;
  }
}
