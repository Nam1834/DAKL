import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Classroom } from '@/models/classroom.model';
import { IClassroomService } from '@/service/interface/i.classroom.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ClassroomController {
  public common: IBaseCrudController<Classroom>;
  private classroomService: IClassroomService<Classroom>;
  constructor(
    @inject('ClassroomService') classroomService: IClassroomService<Classroom>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Classroom>
  ) {
    this.classroomService = classroomService;
    this.common = common;
  }
}
