import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { ValueConfig } from '@/models/value_config.model';
import { IValueConfigService } from '@/service/interface/i.value_config.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ValueConfigController {
  public common: IBaseCrudController<ValueConfig>;
  private valueConfigService: IValueConfigService<ValueConfig>;
  constructor(
    @inject('ValueConfigService') valueConfigService: IValueConfigService<ValueConfig>,
    @inject(ITYPES.Controller) common: IBaseCrudController<ValueConfig>
  ) {
    this.valueConfigService = valueConfigService;
    this.common = common;
  }
}
