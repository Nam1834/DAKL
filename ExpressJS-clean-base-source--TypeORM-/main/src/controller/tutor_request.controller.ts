import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { TutorRequest } from '@/models/tutor_request.model';
import { ITutorRequestService } from '@/service/interface/i.tutor_request.service';
import { ITYPES } from '@/types/interface.types';
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
}
