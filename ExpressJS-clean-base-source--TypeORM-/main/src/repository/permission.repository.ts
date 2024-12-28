import { Permission } from '@/models/permission.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IPermissionRepository } from '@/repository/interface/i.permission.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class PermissionRepository extends BaseRepository<Permission> implements IPermissionRepository<Permission> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Permission));
  }
}
