import { Admin } from '@/models/admin.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class AdminRepository extends BaseRepository<Admin> implements IAdminRepository<Admin> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Admin));
  }
}
