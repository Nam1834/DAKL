import { CurriculumnController } from '@/controller/curriculumn.controller';
import { CurriculumnService } from '@/service/curriculumn.service';
import { Curriculumn } from '@/models/curriculumn.model';
import { CurriculumnRepository } from '@/repository/curriculumn.repository';
import { ICurriculumnService } from '@/service/interface/i.curriculumn.service';
import { ICurriculumnRepository } from '@/repository/interface/i.curriculumn.repository';
import { BaseContainer } from '@/container/base.container';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { Admin } from 'typeorm';
import { adminRepository } from './admin.container';
import { tutorProfileRepository } from './tutor_profile.container';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { IMyCurriculumnItemRepository } from '@/repository/interface/i.my_curriculumn_item.repository';
import { myCurriculumnItemRepository } from './my_curriculumn_item.container';

class CurriculumnContainer extends BaseContainer {
  constructor() {
    super(Curriculumn);
    this.container.bind<ICurriculumnService<Curriculumn>>('CurriculumnService').to(CurriculumnService);
    this.container.bind<ICurriculumnRepository<Curriculumn>>('CurriculumnRepository').to(CurriculumnRepository);
    this.container.bind<CurriculumnController>(CurriculumnController).toSelf();

    //Import
    this.container.bind<IAdminRepository<Admin>>('AdminRepository').toConstantValue(adminRepository);
    this.container.bind<ITutorProfileRepository<any>>('TutorProfileRepository').toConstantValue(tutorProfileRepository);
    this.container
      .bind<IMyCurriculumnItemRepository<any>>('MyCurriculumnItemRepository')
      .toConstantValue(myCurriculumnItemRepository);
  }

  export() {
    const curriculumnController = this.container.get<CurriculumnController>(CurriculumnController);
    const curriculumnService = this.container.get<ICurriculumnService<any>>('CurriculumnService');
    const curriculumnRepository = this.container.get<ICurriculumnRepository<any>>('CurriculumnRepository');

    return { curriculumnController, curriculumnService, curriculumnRepository };
  }
}

const curriculumnContainer = new CurriculumnContainer();
const { curriculumnController, curriculumnService, curriculumnRepository } = curriculumnContainer.export();
export { curriculumnController, curriculumnService, curriculumnRepository };
