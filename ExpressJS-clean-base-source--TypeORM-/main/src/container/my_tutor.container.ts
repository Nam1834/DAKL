import { MyTutorController } from '@/controller/my_tutor.controller';
import { MyTutorService } from '@/service/my_tutor.service';
import { MyTutor } from '@/models/my_tutor.model';
import { MyTutorRepository } from '@/repository/my_tutor.repository';
import { IMyTutorService } from '@/service/interface/i.my_tutor.service';
import { IMyTutorRepository } from '@/repository/interface/i.my_tutor.repository';
import { BaseContainer } from '@/container/base.container';
import { IMyTutorItemRepository } from '@/repository/interface/i.my_tutor_item.repository';
import { myTutorItemRepository } from './my_tutor_item.container';

class MyTutorContainer extends BaseContainer {
  constructor() {
    super(MyTutor);
    this.container.bind<IMyTutorService<MyTutor>>('MyTutorService').to(MyTutorService);
    this.container.bind<IMyTutorRepository<MyTutor>>('MyTutorRepository').to(MyTutorRepository);
    this.container.bind<MyTutorController>(MyTutorController).toSelf();

    //Import
    this.container.bind<IMyTutorItemRepository<any>>('MyTutorItemRepository').toConstantValue(myTutorItemRepository);
  }

  export() {
    const myTutorController = this.container.get<MyTutorController>(MyTutorController);
    const myTutorService = this.container.get<IMyTutorService<any>>('MyTutorService');
    const myTutorRepository = this.container.get<IMyTutorRepository<any>>('MyTutorRepository');

    return { myTutorController, myTutorService, myTutorRepository };
  }
}

const myTutorContainer = new MyTutorContainer();
const { myTutorController, myTutorService, myTutorRepository } = myTutorContainer.export();
export { myTutorController, myTutorService, myTutorRepository };
