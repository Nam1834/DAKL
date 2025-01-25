import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMyCurriculumnService } from '@/service/interface/i.my_curriculumn.service';
import { inject, injectable } from 'inversify';

@injectable()
export class MyCurriculumnService
  extends BaseCrudService<MyCurriculumn>
  implements IMyCurriculumnService<MyCurriculumn>
{
  private myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>;

  constructor(@inject('MyCurriculumnRepository') myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>) {
    super(myCurriculumnRepository);
    this.myCurriculumnRepository = myCurriculumnRepository;
  }
}
