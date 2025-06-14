import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateAssessmentReq } from '@/dto/assessment/create-assessment.req';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { IClassroomAssessmentService } from '@/service/interface/i.classroom_assessment.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/get-search-data.util';
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

  async searchAssessmentWithTime(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      searchData.periodType = req.query.periodType as any;
      searchData.periodValue = req.query.periodValue ? Number(req.query.periodValue) : undefined;

      if (req.query.startDate) {
        const [day, month, year] = (req.query.startDate as string).split('/').map(Number);
        searchData.startDate = new Date(year, month - 1, day);
      }

      if (req.query.endDate) {
        const [day, month, year] = (req.query.endDate as string).split('/').map(Number);
        searchData.endDate = new Date(year, month - 1, day + 1); // thêm 1 ngày để bao trùm cả ngày cuối
      }

      const result = await this.classroomAssessmentService.searchWithTime(searchData);
      res.send_ok('Assessment with time fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async searchAssessmentWithTimeForTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new Error('You must login');
      }
      const tutorId = user.id;

      const searchData: SearchDataDto = getSearchData(req);

      searchData.periodType = req.query.periodType as any;
      searchData.periodValue = req.query.periodValue ? Number(req.query.periodValue) : undefined;

      if (req.query.startDate) {
        const [day, month, year] = (req.query.startDate as string).split('/').map(Number);
        searchData.startDate = new Date(year, month - 1, day);
      }

      if (req.query.endDate) {
        const [day, month, year] = (req.query.endDate as string).split('/').map(Number);
        searchData.endDate = new Date(year, month - 1, day + 1); // thêm 1 ngày để bao trùm cả ngày cuối
      }

      const result = await this.classroomAssessmentService.searchWithTimeForTutor(tutorId, searchData);
      res.send_ok('Assessment with time fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async searchAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.classroomAssessmentService.search(searchData);
      res.send_ok('Assessment fetched successfully', result);
    } catch (error) {
      next(error);
    }
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
