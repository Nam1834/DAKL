import { UserStatus } from '@/enums/user-status.enum';
import { User } from '@/models/user.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource, MoreThanOrEqual } from 'typeorm';

export class UserRepository extends BaseRepository<User> implements IUserRepository<User> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(User));
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
