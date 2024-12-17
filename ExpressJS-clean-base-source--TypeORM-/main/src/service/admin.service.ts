import { Admin } from '@/models/admin.model';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { inject, injectable } from 'inversify';
import { IAdminService } from './interface/i.admin.service';
import { IAdminProfileRepository } from '@/repository/interface/i.admin_profile.repository';
import { AdminProfile } from '@/models/admin_profile.model';

@injectable()
export class AdminService extends BaseCrudService<Admin> implements IAdminService<Admin> {
  private adminRepository: IAdminRepository<Admin>;
  private adminProfileRepository: IAdminProfileRepository<AdminProfile>;

  constructor(
    @inject('AdminRepository') adminRepository: IAdminRepository<Admin>,
    @inject('AdminProfileRepository') adminProfileRepository: IAdminProfileRepository<AdminProfile>
  ) {
    super(adminRepository);
    this.adminRepository = adminRepository;
    this.adminProfileRepository = adminProfileRepository;
  }
}
