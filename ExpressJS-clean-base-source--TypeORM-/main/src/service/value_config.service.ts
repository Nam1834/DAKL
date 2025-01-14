import { ValueConfig } from '@/models/value_config.model';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IValueConfigService } from '@/service/interface/i.value_config.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ValueConfigService extends BaseCrudService<ValueConfig> implements IValueConfigService<ValueConfig> {
  private valueConfigRepository: IValueConfigRepository<ValueConfig>;

  constructor(@inject('ValueConfigRepository') valueConfigRepository: IValueConfigRepository<ValueConfig>) {
    super(valueConfigRepository);
    this.valueConfigRepository = valueConfigRepository;
  }
}
