import { RoleController } from '@/controller/role.controller';
import { RoleService } from '@/service/role.service';
import { Role } from '@/models/role.model';
import { RoleRepository } from '@/repository/role.repository';
import { IRoleService } from '@/service/interface/i.role.service';
import { IRoleRepository } from '@/repository/interface/i.role.repository';
import { BaseContainer } from '@/container/base.container';

class RoleContainer extends BaseContainer {
  constructor() {
    super(Role);
    this.container.bind<IRoleService<Role>>('RoleService').to(RoleService);
    this.container.bind<IRoleRepository<Role>>('RoleRepository').to(RoleRepository);
    this.container.bind<RoleController>(RoleController).toSelf();
  }

  export() {
    const roleController = this.container.get<RoleController>(RoleController);
    const roleService = this.container.get<IRoleService<any>>('RoleService');
    const roleRepository = this.container.get<IRoleRepository<any>>('RoleRepository');

    return { roleController, roleService, roleRepository };
  }
}

const roleContainer = new RoleContainer();
const { roleController, roleService, roleRepository } = roleContainer.export();
export { roleController, roleService, roleRepository };
