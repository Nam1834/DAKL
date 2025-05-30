import { TutorLevel } from '@/models/tutor_level.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class TutorLevelRepository extends BaseRepository<TutorLevel> implements ITutorLevelRepository<TutorLevel> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(TutorLevel));
  }

  async createNewTutorLevel(tutorLevel: TutorLevel): Promise<void> {
    const maxTutorLevelId = await this.ormRepository
      .createQueryBuilder('tutorLevel')
      .select("MAX(CAST(NULLIF(SUBSTRING(tutorLevel.tutorLevelId, 3), '') AS INTEGER))", 'maxTutorLevelId')
      .where("tutorLevel.tutorLevelId ~ '^TL[0-9]+$'") // Chỉ lấy những ID hợp lệ
      .getRawOne();

    const newTutorLevelIdNumber = (maxTutorLevelId?.maxTutorLevelId || 0) + 1;
    const newTutorLevelId = 'TL' + newTutorLevelIdNumber.toString().padStart(4, '0');

    tutorLevel.tutorLevelId = newTutorLevelId;
  }
}
