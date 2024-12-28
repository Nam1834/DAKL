import { Permission } from '@/models/permission.model';
import { IPermissionRepository } from '@/repository/interface/i.permission.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IPermissionService } from '@/service/interface/i.permission.service';
import { inject, injectable } from 'inversify';

@injectable()
export class PermissionService extends BaseCrudService<Permission> implements IPermissionService<Permission> {
  private permissionRepository: IPermissionRepository<Permission>;

  constructor(@inject('PermissionRepository') permissionRepository: IPermissionRepository<Permission>) {
    super(permissionRepository);
    this.permissionRepository = permissionRepository;
  }
}
