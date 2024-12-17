import { AdminProfile } from '@/models/admin_profile.model';
import { AdminProfileRepository } from '@/repository/admin_profile.repository';
import { IAdminProfileRepository } from '@/repository/interface/i.admin_profile.repository';
import { BaseContainer } from '@/container/base.container';

class AdminProfileContainer extends BaseContainer {
  constructor() {
    super(AdminProfile);
    this.container.bind<IAdminProfileRepository<AdminProfile>>('AdminProfileRepository').to(AdminProfileRepository);
  }

  export() {
    const adminProfileRepository = this.container.get<IAdminProfileRepository<any>>('AdminProfileRepository');

    return { adminProfileRepository };
  }
}

const adminProfileContainer = new AdminProfileContainer();
const { adminProfileRepository } = adminProfileContainer.export();
export { adminProfileRepository };
