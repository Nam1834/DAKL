import { UserProfile } from '@/models/user_profile.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IUserProfileRepository } from '@/repository/interface/i.user_profile.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class UserProfileRepository extends BaseRepository<UserProfile> implements IUserProfileRepository<UserProfile> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(UserProfile));
  }
}
