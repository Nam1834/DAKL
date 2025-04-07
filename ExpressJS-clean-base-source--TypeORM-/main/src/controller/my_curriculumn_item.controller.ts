import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { MyCurriculumnItem } from '@/models/my_curriculumn_item.model';
import { IMyCurriculumnItemService } from '@/service/interface/i.my_curriculumn_item.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class MyCurriculumnItemController {
  public common: IBaseCrudController<MyCurriculumnItem>;
  private myCurriculumnItemService: IMyCurriculumnItemService<MyCurriculumnItem>;
  constructor(
    @inject('MyCurriculumnItemService') myCurriculumnItemService: IMyCurriculumnItemService<MyCurriculumnItem>,
    @inject(ITYPES.Controller) common: IBaseCrudController<MyCurriculumnItem>
  ) {
    this.myCurriculumnItemService = myCurriculumnItemService;
    this.common = common;
  }
}
