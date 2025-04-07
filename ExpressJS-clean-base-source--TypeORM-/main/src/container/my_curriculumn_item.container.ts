import { MyCurriculumnItemController } from '@/controller/my_curriculumn_item.controller';
import { MyCurriculumnItemService } from '@/service/my_curriculumn_item.service';
import { MyCurriculumnItemRepository } from '@/repository/my_curriculumn_item.repository';
import { IMyCurriculumnItemService } from '@/service/interface/i.my_curriculumn_item.service';
import { IMyCurriculumnItemRepository } from '@/repository/interface/i.my_curriculumn_item.repository';
import { BaseContainer } from '@/container/base.container';
import { MyCurriculumnItem } from '@/models/my_curriculumn_item.model';

class MyCurriculumnItemContainer extends BaseContainer {
  constructor() {
    super(MyCurriculumnItem);
    this.container
      .bind<IMyCurriculumnItemService<MyCurriculumnItem>>('MyCurriculumnItemService')
      .to(MyCurriculumnItemService);
    this.container
      .bind<IMyCurriculumnItemRepository<MyCurriculumnItem>>('MyCurriculumnItemRepository')
      .to(MyCurriculumnItemRepository);
    this.container.bind<MyCurriculumnItemController>(MyCurriculumnItemController).toSelf();
  }

  export() {
    const myCurriculumnItemController = this.container.get<MyCurriculumnItemController>(MyCurriculumnItemController);
    const myCurriculumnItemService = this.container.get<IMyCurriculumnItemService<any>>('MyCurriculumnItemService');
    const myCurriculumnItemRepository =
      this.container.get<IMyCurriculumnItemRepository<any>>('MyCurriculumnItemRepository');

    return { myCurriculumnItemController, myCurriculumnItemService, myCurriculumnItemRepository };
  }
}

const myCurriculumnItemContainer = new MyCurriculumnItemContainer();
const { myCurriculumnItemController, myCurriculumnItemService, myCurriculumnItemRepository } =
  myCurriculumnItemContainer.export();
export { myCurriculumnItemController, myCurriculumnItemService, myCurriculumnItemRepository };
