import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateAssessmentReq } from '@/dto/assessment/create-assessment.req';
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

  async createAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        throw new Error('You must login');
      }
      const userId = user.id;

      const classroomId = req.params.classroomId;

      const data: CreateAssessmentReq = req.body;

      const result = await this.classroomAssessmentService.createAssessment(userId, classroomId, data);

      res.send_ok('Create assessment successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
