import { MyTutorItemController } from '@/controller/my_tutor_item.controller';
import { MyTutorItemService } from '@/service/my_tutor_item.service';
import { MyTutorItem } from '@/models/my_tutor_item.model';
import { MyTutorItemRepository } from '@/repository/my_tutor_item.repository';
import { IMyTutorItemService } from '@/service/interface/i.my_tutor_item.service';
import { IMyTutorItemRepository } from '@/repository/interface/i.my_tutor_item.repository';
import { BaseContainer } from '@/container/base.container';

class MyTutorItemContainer extends BaseContainer {
  constructor() {
    super(MyTutorItem);
    this.container.bind<IMyTutorItemService<MyTutorItem>>('MyTutorItemService').to(MyTutorItemService);
    this.container.bind<IMyTutorItemRepository<MyTutorItem>>('MyTutorItemRepository').to(MyTutorItemRepository);
    this.container.bind<MyTutorItemController>(MyTutorItemController).toSelf();
  }

  export() {
    const myTutorItemController = this.container.get<MyTutorItemController>(MyTutorItemController);
    const myTutorItemService = this.container.get<IMyTutorItemService<any>>('MyTutorItemService');
    const myTutorItemRepository = this.container.get<IMyTutorItemRepository<any>>('MyTutorItemRepository');

    return { myTutorItemController, myTutorItemService, myTutorItemRepository };
  }
}

const myTutorItemContainer = new MyTutorItemContainer();
const { myTutorItemController, myTutorItemService, myTutorItemRepository } = myTutorItemContainer.export();
export { myTutorItemController, myTutorItemService, myTutorItemRepository };
