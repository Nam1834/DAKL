import { UserStatus } from '@/enums/user-status.enum';
import { Curriculumn } from '@/models/curriculumn.model';
import { MyCurriculumnItem } from '@/models/my-curriculumn-item.model';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { User } from '@/models/user.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource, MoreThanOrEqual } from 'typeorm';

export class UserRepository extends BaseRepository<User> implements IUserRepository<User> {
  private datasource: DataSource;
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(User));
    this.datasource = dataSource;
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
}
