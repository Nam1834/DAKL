import { ValueConfigController } from '@/controller/value_config.controller';
import { ValueConfigService } from '@/service/value_config.service';
import { ValueConfig } from '@/models/value_config.model';
import { ValueConfigRepository } from '@/repository/value_config.repository';
import { IValueConfigService } from '@/service/interface/i.value_config.service';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { BaseContainer } from '@/container/base.container';

class ValueConfigContainer extends BaseContainer {
  constructor() {
    super(ValueConfig);
    this.container.bind<IValueConfigService<ValueConfig>>('ValueConfigService').to(ValueConfigService);
    this.container.bind<IValueConfigRepository<ValueConfig>>('ValueConfigRepository').to(ValueConfigRepository);
    this.container.bind<ValueConfigController>(ValueConfigController).toSelf();
  }

  export() {
    const valueConfigController = this.container.get<ValueConfigController>(ValueConfigController);
    const valueConfigService = this.container.get<IValueConfigService<any>>('ValueConfigService');
    const valueConfigRepository = this.container.get<IValueConfigRepository<any>>('ValueConfigRepository');

    return { valueConfigController, valueConfigService, valueConfigRepository };
  }
}

const valueConfigContainer = new ValueConfigContainer();
const { valueConfigController, valueConfigService, valueConfigRepository } = valueConfigContainer.export();
export { valueConfigController, valueConfigService, valueConfigRepository };
