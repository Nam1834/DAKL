import { Admin } from '@/models/admin.model';
import { AdminProfile } from '@/models/admin_profile.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';

export class AdminRepository extends BaseRepository<Admin> implements IAdminRepository<Admin> {
  private adminProfileRepository: Repository<AdminProfile>;
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Admin));
    this.adminProfileRepository = dataSource.getRepository(AdminProfile);
  }

  async createNewAdmin(admin: Admin): Promise<void> {
    const maxAdminId = await this.ormRepository
      .createQueryBuilder('admin')
      .select('MAX(CAST(SUBSTRING(admin.adminId, 3) AS INTEGER))', 'maxAdminId') // Thay UNSIGNED bằng INTEGER
      .getRawOne();

    // Tạo giá trị adminId mới theo định dạng NV0001, NV0002, ...
    const newAdminIdNumber = (maxAdminId?.maxAdminId || 0) + 1; // Lấy số tiếp theo từ giá trị lớn nhất
    const newAdminId = 'NV' + newAdminIdNumber.toString().padStart(4, '0'); // Tạo adminId theo định dạng NV0001

    // Gán adminId mới vào admin
    admin.adminId = newAdminId;

    // Lưu admin vào bảng admin
    const createdAdmin = await this.ormRepository
      .createQueryBuilder()
      .insert()
      .values(admin)
      .returning('admin_id')
      .execute();

    const createdAdminId = createdAdmin.identifiers[0].adminId;

    // Gán adminId vào adminProfile
    let adminProfile = new AdminProfile();
    adminProfile = admin.adminProfile;
    adminProfile.adminId = createdAdminId; // Gán adminId cho adminProfile

    // Lưu adminProfile vào bảng admin_profiles
    await this.adminProfileRepository.save(adminProfile);
  }

  async totalNewAdmin(): Promise<number> {
    //Total Admin that have been created from 3 days ago
    return await this.ormRepository.count({
      where: {
        createdAt: MoreThanOrEqual(new Date(new Date().setDate(new Date().getDate() - 3)))
      }
    });
  }
}
