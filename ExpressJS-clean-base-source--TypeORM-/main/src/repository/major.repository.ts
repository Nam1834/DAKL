import { Major } from '@/models/major.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IMajorRepository } from '@/repository/interface/i.major.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class MajorRepository extends BaseRepository<Major> implements IMajorRepository<Major> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Major));
  }

  async createNewMajor(major: Major): Promise<void> {
    const maxMajorId = await this.ormRepository
      .createQueryBuilder('major')
      .select("MAX(CAST(NULLIF(SUBSTRING(major.majorId, 2), '') AS INTEGER))", 'maxMajorId')
      .where("major.majorId ~ '^M[0-9]+$'") // Chỉ lấy những ID hợp lệ
      .getRawOne();

    const newMajorIdNumber = (maxMajorId?.maxMajorId || 0) + 1;
    const newMajorId = 'M' + newMajorIdNumber.toString().padStart(4, '0');

    major.majorId = newMajorId;
  }
}
