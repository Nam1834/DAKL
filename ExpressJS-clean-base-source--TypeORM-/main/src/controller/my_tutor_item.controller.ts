import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { MyTutorItem } from '@/models/my_tutor_item.model';
import { IMyTutorItemService } from '@/service/interface/i.my_tutor_item.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class MyTutorItemController {
  public common: IBaseCrudController<MyTutorItem>;
  private myTutorItemService: IMyTutorItemService<MyTutorItem>;
  constructor(
    @inject('MyTutorItemService') myTutorItemService: IMyTutorItemService<MyTutorItem>,
    @inject(ITYPES.Controller) common: IBaseCrudController<MyTutorItem>
  ) {
    this.myTutorItemService = myTutorItemService;
    this.common = common;
  }
}
