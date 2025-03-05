import { TutorLevelController } from '@/controller/tutor_level.controller';
import { TutorLevelService } from '@/service/tutor_level.service';
import { TutorLevel } from '@/models/tutor_level.model';
import { TutorLevelRepository } from '@/repository/tutor_level.repository';
import { ITutorLevelService } from '@/service/interface/i.tutor_level.service';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { BaseContainer } from '@/container/base.container';

class TutorLevelContainer extends BaseContainer {
  constructor() {
    super(TutorLevel);
    this.container.bind<ITutorLevelService<TutorLevel>>('TutorLevelService').to(TutorLevelService);
    this.container.bind<ITutorLevelRepository<TutorLevel>>('TutorLevelRepository').to(TutorLevelRepository);
    this.container.bind<TutorLevelController>(TutorLevelController).toSelf();
  }

  export() {
    const tutorLevelController = this.container.get<TutorLevelController>(TutorLevelController);
    const tutorLevelService = this.container.get<ITutorLevelService<any>>('TutorLevelService');
    const tutorLevelRepository = this.container.get<ITutorLevelRepository<any>>('TutorLevelRepository');

    return { tutorLevelController, tutorLevelService, tutorLevelRepository };
  }
}

const tutorLevelContainer = new TutorLevelContainer();
const { tutorLevelController, tutorLevelService, tutorLevelRepository } = tutorLevelContainer.export();
export { tutorLevelController, tutorLevelService, tutorLevelRepository };
