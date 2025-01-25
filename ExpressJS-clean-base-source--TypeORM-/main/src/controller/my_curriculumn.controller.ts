import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { IMyCurriculumnService } from '@/service/interface/i.my_curriculumn.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class MyCurriculumnController {
  public common: IBaseCrudController<MyCurriculumn>;
  private myCurriculumnService: IMyCurriculumnService<MyCurriculumn>;
  constructor(
    @inject('MyCurriculumnService') myCurriculumnService: IMyCurriculumnService<MyCurriculumn>,
    @inject(ITYPES.Controller) common: IBaseCrudController<MyCurriculumn>
  ) {
    this.myCurriculumnService = myCurriculumnService;
    this.common = common;
  }
}
