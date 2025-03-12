import { ValueConfig } from '@/models/value_config.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ValueConfigRepository extends BaseRepository<ValueConfig> implements IValueConfigRepository<ValueConfig> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ValueConfig));
  }

  async createNewValueConfig(valueConfig: ValueConfig): Promise<void> {
    const maxValueConfigId = await this.ormRepository
      .createQueryBuilder('valueConfig')
      .select("MAX(CAST(NULLIF(SUBSTRING(valueConfig.valueConfigId, 3), '') AS INTEGER))", 'maxValueConfigId')
      .where("valueConfig.valueConfigId ~ '^VC[0-9]+$'") // Chỉ lấy những ID hợp lệ
      .getRawOne();

    const newValueConfigIdNumber = (maxValueConfigId?.maxValueConfigId || 0) + 1;
    const newValueConfigId = 'VC' + newValueConfigIdNumber.toString().padStart(4, '0');

    valueConfig.valueConfigId = newValueConfigId;
  }
}
