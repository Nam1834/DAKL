import { StatisticalController } from '@/controller/statistical.controller';
import { StatisticalService } from '@/service/statistical.service';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { ITYPES } from '@/types/interface.types';
import { AppDataSourceSingleton } from '@/database/db.datasource';

import { IOrderRepository } from '@/repository/interface/i.order.repository';
import { orderRepository } from '@/container/order.container';

import { IStatisticalRepository } from '@/repository/interface/i.statistical.repository';
import { StatisticalRepository } from '@/repository/statistical.repository';
import { IStatisticalService } from '@/service/interface/i.statistical.service';

class StatisticalContainer {
  private container = new Container();

  constructor() {
    this.container.bind<DataSource>(ITYPES.Datasource).toConstantValue(AppDataSourceSingleton.getInstance());
    this.container.bind<IStatisticalService>('StatisticalService').to(StatisticalService);
    this.container.bind<StatisticalController>(StatisticalController).toSelf();

    //Import
    this.container.bind<IStatisticalRepository>('StatisticalRepository').to(StatisticalRepository);
  }

  export() {
    const statisticalController = this.container.get<StatisticalController>(StatisticalController);
    const statisticalService = this.container.get<IStatisticalService>('StatisticalService');
    return { statisticalController, statisticalService };
  }
}

const statisticalContainer = new StatisticalContainer();
const { statisticalController, statisticalService } = statisticalContainer.export();
export { statisticalController, statisticalService };
