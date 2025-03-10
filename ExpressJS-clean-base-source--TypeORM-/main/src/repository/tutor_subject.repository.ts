import { TutorSubject } from '@/models/tutor_subject.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ITutorSubjectRepository } from '@/repository/interface/i.tutor_subject.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class TutorSubjectRepository
  extends BaseRepository<TutorSubject>
  implements ITutorSubjectRepository<TutorSubject>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(TutorSubject));
  }
}
