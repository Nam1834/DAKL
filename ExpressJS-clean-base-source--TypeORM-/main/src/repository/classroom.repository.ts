import { Classroom } from '@/models/classroom.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ClassroomRepository extends BaseRepository<Classroom> implements IClassroomRepository<Classroom> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Classroom));
  }

  async updateManyStatus(classroomIds: string[], status: string): Promise<void> {
    if (!classroomIds || classroomIds.length === 0) return;

    await this.ormRepository
      .createQueryBuilder('classroom')
      .update(Classroom)
      .set({ status: status })
      .whereInIds(classroomIds)
      .execute();
  }
}
