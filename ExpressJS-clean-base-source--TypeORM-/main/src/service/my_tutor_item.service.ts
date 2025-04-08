import { MyTutorItem } from '@/models/my_tutor_item.model';
import { IMyTutorItemRepository } from '@/repository/interface/i.my_tutor_item.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMyTutorItemService } from '@/service/interface/i.my_tutor_item.service';
import { inject, injectable } from 'inversify';

@injectable()
export class MyTutorItemService extends BaseCrudService<MyTutorItem> implements IMyTutorItemService<MyTutorItem> {
  private myTutorItemRepository: IMyTutorItemRepository<MyTutorItem>;

  constructor(@inject('MyTutorItemRepository') myTutorItemRepository: IMyTutorItemRepository<MyTutorItem>) {
    super(myTutorItemRepository);
    this.myTutorItemRepository = myTutorItemRepository;
  }
}
