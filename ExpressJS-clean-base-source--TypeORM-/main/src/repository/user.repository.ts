import { UserStatus } from '@/enums/user-status.enum';
import { Curriculumn } from '@/models/curriculumn.model';
import { MyCurriculumnItem } from '@/models/my_curriculumn_item.model';
import { MyCurriculumn } from '@/models/my_curriculumn.model';
import { User } from '@/models/user.model';
import { UserProfile } from '@/models/user_profile.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource, MoreThanOrEqual, Not, Repository } from 'typeorm';

export class UserRepository extends BaseRepository<User> implements IUserRepository<User> {
  private datasource: DataSource;
  private userProfileRepository: Repository<UserProfile>;
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(User));
    this.datasource = dataSource;
    this.userProfileRepository = dataSource.getRepository(UserProfile);
  }

  async createNewUser(user: User): Promise<void> {
    const maxUserId = await this.ormRepository
      .createQueryBuilder('user')
      .select('MAX(CAST(SUBSTRING(user.userId, 3) AS INTEGER))', 'maxUserId') // Thay UNSIGNED bằng INTEGER
      .getRawOne();

    const newUserIdNumber = (maxUserId?.maxUserId || 0) + 1; // Lấy số tiếp theo từ giá trị lớn nhất
    const newUserId = 'US' + newUserIdNumber.toString().padStart(5, '0'); // Tạo adminId theo định dạng NV0001

    // Gán adminId mới vào admin
    user.userId = newUserId;

    const createdUser = await this.ormRepository
      .createQueryBuilder()
      .insert()
      .values(user)
      .returning('user_id')
      .execute();

    const createdUserId = createdUser.identifiers[0].userId;

    // Gán adminId vào adminProfile
    let userrofile = new UserProfile();
    userrofile = user.userProfile;
    userrofile.userId = createdUserId; // Gán adminId cho adminProfile

    // Lưu adminProfile vào bảng admin_profiles
    await this.userProfileRepository.save(userrofile);
  }

  async updateUserWithTransaction(user: User, myCurriculumn: MyCurriculumn, curriculumn: Curriculumn): Promise<void> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Xóa toàn bộ MyCurriculumnItem cũ nếu có
      await queryRunner.manager.delete(MyCurriculumnItem, { myCurriculumnId: myCurriculumn.myCurriculumnId });

      // Lưu dữ liệu vào database
      await queryRunner.manager.save(user);
      await queryRunner.manager.save(curriculumn);
      await queryRunner.manager.save(myCurriculumn);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async totalNewRequest(): Promise<number> {
    //Total request that have been created from 3 days ago
    return await this.ormRepository.count({
      where: {
        status: UserStatus.REQUEST,
        updatedAt: MoreThanOrEqual(new Date(new Date().setDate(new Date().getDate() - 3)))
      }
    });
  }

  async checkEmail(email: string, id: string): Promise<void> {
    if (!email) {
      return; // Nếu không được truyền vào, bỏ qua kiểm tra
    }

    const checkEmail = await this.ormRepository.findOne({ where: { email: email, userId: Not(id) } });
    if (checkEmail) {
      throw new Error('Email has been exist!');
    }
  }

  async checkPhoneNumber(phoneNumber: string, id: string): Promise<void> {
    if (!phoneNumber) {
      return; // Nếu phoneNumber không được truyền vào, bỏ qua kiểm tra
    }
    const checkPhoneNumber = await this.ormRepository.findOne({
      where: { phoneNumber: phoneNumber, userId: Not(id) }
    });
    if (checkPhoneNumber) {
      throw new Error('PhoneNumber has been exist!');
    }
  }
}
