import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { AddToMyCurriculumnReq } from '@/dto/my-curriculumn/add-to-my-curriculumn.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { IMyCurriculumnService } from '@/service/interface/i.my_curriculumn.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
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

  async getMyCurriculumn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new BaseError(ErrorCode.AUTH_01, 'User not login!');
      }

      const userId = user.id;

      const result = await this.myCurriculumnService.getMyCurriculumn(userId);

      res.send_ok('Get My Curriculumn successfully', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /cart/add
   */
  async addToMyCurriculumn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const data: AddToMyCurriculumnReq = req.body;

      if (!user) {
        throw new BaseError(ErrorCode.AUTH_01, 'User not login!');
      }

      const userId = user.id;

      await this.myCurriculumnService.addToMyCurrriculumn(userId, data);

      res.send_ok('Add to My Curriculumn sucessfully');
    } catch (error) {
      next(error);
    }
  }
}
