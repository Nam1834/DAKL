import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { AddToMyCurriculumnReq } from '@/dto/my-curriculumn/add-to-my-curriculumn.req';
import { PagingDto } from '@/dto/paging.dto';
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

      const page = Number(req.query.page) || 1;
      const rpp = Number(req.query.rpp) || 10;

      const paging = new PagingDto(page, rpp);

      const userId = user.id;

      const result = await this.myCurriculumnService.getMyCurriculumn(userId, paging);

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

  async removeFromMyCurriculumn(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const curriculumnId = req.params.curriculumnId;

      if (!user) {
        throw new BaseError(ErrorCode.AUTH_01, 'Học viên chưa đăng nhập');
      }

      const userId = user.id;

      await this.myCurriculumnService.removeFromMyCurriculumn(userId, curriculumnId);

      res.send_ok('Remove from My Curriculumn successfully');
    } catch (error) {
      next(error);
    }
  }
}
