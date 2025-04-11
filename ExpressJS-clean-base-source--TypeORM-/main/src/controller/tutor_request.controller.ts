import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { UpdateTutorProfileReq } from '@/dto/tutor/update-tutor-profile.req';
import { TutorRequest } from '@/models/tutor_request.model';
import { ITutorRequestService } from '@/service/interface/i.tutor_request.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorRequestController {
  public common: IBaseCrudController<TutorRequest>;
  private tutorRequestService: ITutorRequestService<TutorRequest>;
  constructor(
    @inject('TutorRequestService') tutorRequestService: ITutorRequestService<TutorRequest>,
    @inject(ITYPES.Controller) common: IBaseCrudController<TutorRequest>
  ) {
    this.tutorRequestService = tutorRequestService;
    this.common = common;
  }

  async searchTutorRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.tutorRequestService.search(searchData);
      res.send_ok('Tutor Request fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async regisUserToTutor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }

      const requestBody: RegisToTutorReq = req.body;
      const result = await this.tutorRequestService.regisToTutor(userId, requestBody);
      res.send_ok('Register Tutor successful', result);
    } catch (error) {
      next(error);
    }
  }

  async updateTutorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }

      const data: UpdateTutorProfileReq = req.body;
      const result = await this.tutorRequestService.updateTutorProfile(userId, data);
      res.send_ok('update Tutor successful', result);
    } catch (error) {
      next(error);
    }
  }

  async solveRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const tutorRequestId = req.params.tutorRequestId;

      const click: string = req.body.click;
      const tutorLevelId: string = req.body.tutorLevelId;
      const result = await this.tutorRequestService.solveRequest(tutorRequestId, click, tutorLevelId);

      res.send_ok('Request solve successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
