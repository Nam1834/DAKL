import { AdminController } from '@/controller/admin.controller';
import { AdminService } from '@/service/admin.service';
import { Admin } from '@/models/admin.model';
import { AdminRepository } from '@/repository/admin.repository';
import { IAdminService } from '@/service/interface/i.admin.service';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { BaseContainer } from '@/container/base.container';
import { IAdminProfileRepository } from '@/repository/interface/i.admin_profile.repository';
import { adminProfileRepository } from './admin_profile.container';

class AdminContainer extends BaseContainer {
  constructor() {
    super(Admin);
    this.container.bind<IAdminService<Admin>>('AdminService').to(AdminService);
    this.container.bind<IAdminRepository<Admin>>('AdminRepository').to(AdminRepository);
    this.container.bind<AdminController>(AdminController).toSelf();

    //Import
    this.container.bind<IAdminProfileRepository<any>>('AdminProfileRepository').toConstantValue(adminProfileRepository);
  }

  export() {
    const adminController = this.container.get<AdminController>(AdminController);
    const adminService = this.container.get<IAdminService<any>>('AdminService');
    const adminRepository = this.container.get<IAdminRepository<any>>('AdminRepository');

    return { adminController, adminService, adminRepository };
  }
}

const adminContainer = new AdminContainer();
const { adminController, adminService, adminRepository } = adminContainer.export();
export { adminController, adminService, adminRepository };
