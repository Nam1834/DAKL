import { Admin } from '@/models/admin.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource, MoreThanOrEqual } from 'typeorm';

export class AdminRepository extends BaseRepository<Admin> implements IAdminRepository<Admin> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Admin));
  }

  async totalNewAdmin(): Promise<number> {
    //Total Admin that have been created from 3 days ago
    return await this.ormRepository.count({
      where: {
        createdAt: MoreThanOrEqual(new Date(new Date().setDate(new Date().getDate() - 3)))
      }
    });
  }
}
