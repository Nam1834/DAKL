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
}
