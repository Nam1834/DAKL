import { TutorProfile } from '@/models/tutor_profile.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class TutorProfileRepository
  extends BaseRepository<TutorProfile>
  implements ITutorProfileRepository<TutorProfile>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(TutorProfile));
  }
}
