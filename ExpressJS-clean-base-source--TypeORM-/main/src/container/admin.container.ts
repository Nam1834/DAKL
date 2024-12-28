import { AdminController } from '@/controller/admin.controller';
import { AdminService } from '@/service/admin.service';
import { Admin } from '@/models/admin.model';
import { AdminRepository } from '@/repository/admin.repository';
import { IAdminService } from '@/service/interface/i.admin.service';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { BaseContainer } from '@/container/base.container';
import { IAdminProfileRepository } from '@/repository/interface/i.admin_profile.repository';
import { adminProfileRepository } from './admin_profile.container';
import { INotificationService } from '@/service/interface/i.notification.service';
import { notificationService } from './notification.container';
import { IRolePermissionRepository } from '@/repository/interface/i.role_permission.repository';
import { rolePermissionRepository } from './role_permission.container';
import { IPermissionRepository } from '@/repository/interface/i.permission.repository';
import { permissionRepository } from './permission.container';
import { roleRepository } from './role.container';
import { IRoleRepository } from '@/repository/interface/i.role.repository';

class AdminContainer extends BaseContainer {
  constructor() {
    super(Admin);
    this.container.bind<IAdminService<Admin>>('AdminService').to(AdminService);
    this.container.bind<IAdminRepository<Admin>>('AdminRepository').to(AdminRepository);
    this.container.bind<AdminController>(AdminController).toSelf();

    //Import
    this.container.bind<IPermissionRepository<any>>('PermissionRepository').toConstantValue(permissionRepository);
    this.container.bind<IAdminProfileRepository<any>>('AdminProfileRepository').toConstantValue(adminProfileRepository);
    this.container.bind<INotificationService<any>>('NotificationService').toConstantValue(notificationService);
    this.container.bind<IRoleRepository<any>>('RoleRepository').toConstantValue(roleRepository);
    this.container
      .bind<IRolePermissionRepository<any>>('RolePermissionRepository')
      .toConstantValue(rolePermissionRepository);
  }

  export() {
    const adminController = this.container.get<AdminController>(AdminController);
    const adminService = this.container.get<IAdminService<any>>('AdminService');
    const adminRepository = this.container.get<IAdminRepository<any>>('AdminRepository');
    const adminContainer = this.container;

    return { adminController, adminService, adminRepository, adminContainer };
  }
}

const adminContainer = new AdminContainer();
const { adminController, adminService, adminRepository } = adminContainer.export();
export { adminController, adminService, adminRepository };
