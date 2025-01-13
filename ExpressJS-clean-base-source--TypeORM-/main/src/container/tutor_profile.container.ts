import { TutorProfile } from '@/models/tutor_profile.model';
import { TutorProfileRepository } from '@/repository/tutor_profile.repository';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { BaseContainer } from '@/container/base.container';

class TutorProfileContainer extends BaseContainer {
  constructor() {
    super(TutorProfile);
    this.container.bind<ITutorProfileRepository<TutorProfile>>('TutorProfileRepository').to(TutorProfileRepository);
  }

  export() {
    const tutorProfileRepository = this.container.get<ITutorProfileRepository<any>>('TutorProfileRepository');

    return { tutorProfileRepository };
  }
}

const tutorProfileContainer = new TutorProfileContainer();
const { tutorProfileRepository } = tutorProfileContainer.export();
export { tutorProfileRepository };
