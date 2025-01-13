import { Meeting } from '@/models/meeting.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IMeetingRepository } from '@/repository/interface/i.meeting.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class MeetingRepository extends BaseRepository<Meeting> implements IMeetingRepository<Meeting> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Meeting));
  }
}
