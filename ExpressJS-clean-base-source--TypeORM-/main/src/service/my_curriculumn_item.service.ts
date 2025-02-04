import { MyCurriculumnItem } from '@/models/my-curriculumn-item.model';
import { IMyCurriculumnItemRepository } from '@/repository/interface/i.my_curriculumn_item.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMyCurriculumnItemService } from '@/service/interface/i.my_curriculumn_item.service';
import { inject, injectable } from 'inversify';

@injectable()
export class MyCurriculumnItemService
  extends BaseCrudService<MyCurriculumnItem>
  implements IMyCurriculumnItemService<MyCurriculumnItem>
{
  private myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>;

  constructor(
    @inject('MyCurriculumnItemRepository') myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>
  ) {
    super(myCurriculumnItemRepository);
    this.myCurriculumnItemRepository = myCurriculumnItemRepository;
  }
}
