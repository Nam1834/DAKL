import { Curriculumn } from '@/models/curriculumn.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ICurriculumnRepository } from '@/repository/interface/i.curriculumn.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class CurriculumnRepository extends BaseRepository<Curriculumn> implements ICurriculumnRepository<Curriculumn> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Curriculumn));
  }

  async createNewCurriculumn(curriculumn: Curriculumn): Promise<void> {
    const maxCurriculumnId = await this.ormRepository
      .createQueryBuilder('curriculumn')
      .select("MAX(CAST(NULLIF(SUBSTRING(curriculumn.curriculumnId, 2), '') AS INTEGER))", 'maxCurriculumnId')
      .where("curriculumn.curriculumnId ~ '^C[0-9]+$'") // Chỉ lấy những ID hợp lệ
      .getRawOne();

    const newCurriculumnIdNumber = (maxCurriculumnId?.maxCurriculumnId || 0) + 1;
    const newCurriculumnId = 'C' + newCurriculumnIdNumber.toString().padStart(5, '0');

    curriculumn.curriculumnId = newCurriculumnId;
  }
}
