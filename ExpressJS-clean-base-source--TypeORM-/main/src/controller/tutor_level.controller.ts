import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { TutorLevel } from '@/models/tutor_level.model';
import { ITutorLevelService } from '@/service/interface/i.tutor_level.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorLevelController {
  public common: IBaseCrudController<TutorLevel>;
  private tutorLevelService: ITutorLevelService<TutorLevel>;
  constructor(
    @inject('TutorLevelService') tutorLevelService: ITutorLevelService<TutorLevel>,
    @inject(ITYPES.Controller) common: IBaseCrudController<TutorLevel>
  ) {
    this.tutorLevelService = tutorLevelService;
    this.common = common;
  }
}
