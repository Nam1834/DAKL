import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { IClassroomAssessmentService } from '@/service/interface/i.classroom_assessment.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ClassroomAssessmentController {
  public common: IBaseCrudController<ClassroomAssessment>;
  private classroomAssessmentService: IClassroomAssessmentService<ClassroomAssessment>;
  constructor(
    @inject('ClassroomAssessmentService') classroomAssessmentService: IClassroomAssessmentService<ClassroomAssessment>,
    @inject(ITYPES.Controller) common: IBaseCrudController<ClassroomAssessment>
  ) {
    this.classroomAssessmentService = classroomAssessmentService;
    this.common = common;
  }
}
