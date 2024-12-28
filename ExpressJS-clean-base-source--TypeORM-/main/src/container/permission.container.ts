import { PermissionController } from '@/controller/permission.controller';
import { PermissionService } from '@/service/permission.service';
import { Permission } from '@/models/permission.model';
import { PermissionRepository } from '@/repository/permission.repository';
import { IPermissionService } from '@/service/interface/i.permission.service';
import { IPermissionRepository } from '@/repository/interface/i.permission.repository';
import { BaseContainer } from '@/container/base.container';

class PermissionContainer extends BaseContainer {
  constructor() {
    super(Permission);
    this.container.bind<IPermissionService<Permission>>('PermissionService').to(PermissionService);
    this.container.bind<IPermissionRepository<Permission>>('PermissionRepository').to(PermissionRepository);
    this.container.bind<PermissionController>(PermissionController).toSelf();
  }

  export() {
    const permissionController = this.container.get<PermissionController>(PermissionController);
    const permissionService = this.container.get<IPermissionService<any>>('PermissionService');
    const permissionRepository = this.container.get<IPermissionRepository<any>>('PermissionRepository');

    return { permissionController, permissionService, permissionRepository };
  }
}

const permissionContainer = new PermissionContainer();
const { permissionController, permissionService, permissionRepository } = permissionContainer.export();
export { permissionController, permissionService, permissionRepository };
