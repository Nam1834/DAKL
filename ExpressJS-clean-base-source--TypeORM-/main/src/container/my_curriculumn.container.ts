import { MyCurriculumnController } from '@/controller/my_curriculumn.controller';
import { MyCurriculumnService } from '@/service/my_curriculumn.service';
import { MyCurriculumnRepository } from '@/repository/my_curriculumn.repository';
import { IMyCurriculumnService } from '@/service/interface/i.my_curriculumn.service';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { BaseContainer } from '@/container/base.container';
import { MyCurriculumn } from '@/models/my-curriculumn.model';

class MyCurriculumnContainer extends BaseContainer {
  constructor() {
    super(MyCurriculumn);
    this.container.bind<IMyCurriculumnService<MyCurriculumn>>('MyCurriculumnService').to(MyCurriculumnService);
    this.container.bind<IMyCurriculumnRepository<MyCurriculumn>>('MyCurriculumnRepository').to(MyCurriculumnRepository);
    this.container.bind<MyCurriculumnController>(MyCurriculumnController).toSelf();
  }

  export() {
    const myCurriculumnController = this.container.get<MyCurriculumnController>(MyCurriculumnController);
    const myCurriculumnService = this.container.get<IMyCurriculumnService<any>>('MyCurriculumnService');
    const myCurriculumnRepository = this.container.get<IMyCurriculumnRepository<any>>('MyCurriculumnRepository');

    return { myCurriculumnController, myCurriculumnService, myCurriculumnRepository };
  }
}

const myCurriculumnContainer = new MyCurriculumnContainer();
const { myCurriculumnController, myCurriculumnService, myCurriculumnRepository } = myCurriculumnContainer.export();
export { myCurriculumnController, myCurriculumnService, myCurriculumnRepository };
