import { MajorController } from '@/controller/major.controller';
import { MajorService } from '@/service/major.service';
import { Major } from '@/models/major.model';
import { MajorRepository } from '@/repository/major.repository';
import { IMajorService } from '@/service/interface/i.major.service';
import { IMajorRepository } from '@/repository/interface/i.major.repository';
import { BaseContainer } from '@/container/base.container';

class MajorContainer extends BaseContainer {
  constructor() {
    super(Major);
    this.container.bind<IMajorService<Major>>('MajorService').to(MajorService);
    this.container.bind<IMajorRepository<Major>>('MajorRepository').to(MajorRepository);
    this.container.bind<MajorController>(MajorController).toSelf();
  }

  export() {
    const majorController = this.container.get<MajorController>(MajorController);
    const majorService = this.container.get<IMajorService<any>>('MajorService');
    const majorRepository = this.container.get<IMajorRepository<any>>('MajorRepository');

    return { majorController, majorService, majorRepository };
  }
}

const majorContainer = new MajorContainer();
const { majorController, majorService, majorRepository } = majorContainer.export();
export { majorController, majorService, majorRepository };
