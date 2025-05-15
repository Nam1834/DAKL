import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Classroom } from '@/models/classroom.model';
import { IClassroomService } from '@/service/interface/i.classroom.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/get-search-data.util';
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

  async searchForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new Error('You must login');
      }
      const userId = user.id;

      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.classroomService.getListClassroomForUser(userId, searchData);
      res.send_ok('Classroom fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async searchForTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const tutor = req.user;
      if (!tutor) {
        throw new Error('You must login');
      }
      const tutorId = tutor.id;

      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.classroomService.getListClassroomForTutor(tutorId, searchData);
      res.send_ok('Classroom fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
