import { ManageBankingController } from '@/controller/manage_banking.controller';
import { ManageBankingService } from '@/service/manage_banking.service';
import { ManageBanking } from '@/models/manage_banking.model';
import { ManageBankingRepository } from '@/repository/manage_banking.repository';
import { IManageBankingService } from '@/service/interface/i.manage_banking.service';
import { IManageBankingRepository } from '@/repository/interface/i.manage_banking.repository';
import { BaseContainer } from '@/container/base.container';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { UserRepository } from '@/repository/user.repository';

class ManageBankingContainer extends BaseContainer {
  constructor() {
    super(ManageBanking);
    this.container.bind<IManageBankingService<ManageBanking>>('ManageBankingService').to(ManageBankingService);
    this.container.bind<IManageBankingRepository<ManageBanking>>('ManageBankingRepository').to(ManageBankingRepository);
    this.container.bind<ManageBankingController>(ManageBankingController).toSelf();

    //Import
    this.container.bind<IUserRepository<any>>('UserRepository').to(UserRepository);
  }

  export() {
    const manageBankingController = this.container.get<ManageBankingController>(ManageBankingController);
    const manageBankingService = this.container.get<IManageBankingService<any>>('ManageBankingService');
    const manageBankingRepository = this.container.get<IManageBankingRepository<any>>('ManageBankingRepository');

    return { manageBankingController, manageBankingService, manageBankingRepository };
  }
}

const manageBankingContainer = new ManageBankingContainer();
const { manageBankingController, manageBankingService, manageBankingRepository } = manageBankingContainer.export();
export { manageBankingController, manageBankingService, manageBankingRepository };
