import { AdminProfile } from '@/models/admin_profile.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IAdminProfileRepository } from '@/repository/interface/i.admin_profile.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class AdminProfileRepository
  extends BaseRepository<AdminProfile>
  implements IAdminProfileRepository<AdminProfile>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(AdminProfile));
  }
}
