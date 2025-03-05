import { TutorLevel } from '@/models/tutor_level.model';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITutorLevelService } from '@/service/interface/i.tutor_level.service';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorLevelService extends BaseCrudService<TutorLevel> implements ITutorLevelService<TutorLevel> {
  private tutorLevelRepository: ITutorLevelRepository<TutorLevel>;

  constructor(@inject('TutorLevelRepository') tutorLevelRepository: ITutorLevelRepository<TutorLevel>) {
    super(tutorLevelRepository);
    this.tutorLevelRepository = tutorLevelRepository;
  }
}
