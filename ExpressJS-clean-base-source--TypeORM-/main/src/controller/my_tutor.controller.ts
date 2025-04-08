import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { AddToMyTutorReq } from '@/dto/my-tutor/add-to-my-tutor.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { MyTutor } from '@/models/my_tutor.model';
import { IMyTutorService } from '@/service/interface/i.my_tutor.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class MyTutorController {
  public common: IBaseCrudController<MyTutor>;
  private myTutorService: IMyTutorService<MyTutor>;
  constructor(
    @inject('MyTutorService') myTutorService: IMyTutorService<MyTutor>,
    @inject(ITYPES.Controller) common: IBaseCrudController<MyTutor>
  ) {
    this.myTutorService = myTutorService;
    this.common = common;
  }

  /**
   * * GET /cart/me
   */
  async getMyTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;

      if (!user) {
        throw new BaseError(ErrorCode.AUTH_01, 'Học viên chưa đăng nhập');
      }

      const userId = user.id;

      const result = await this.myTutorService.getMyTutor(userId);

      res.send_ok('Lấy danh sách gia sư yêu thích thành công', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * * POST /cart/add
   */
  async addToMyTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const data: AddToMyTutorReq = req.body;

      if (!user) {
        throw new BaseError(ErrorCode.AUTH_01, 'Học viên chưa đăng nhập');
      }

      const userId = user.id;

      await this.myTutorService.addToMyTutor(userId, data);

      res.send_ok('Thêm vào danh sách gia sư yêu thích thành công');
    } catch (error) {
      next(error);
    }
  }

  /**
   * * DELETE /cart/remove/:courseId
   */
  async removeFromMytutor(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const tutorId = req.params.tutorId;

      if (!user) {
        throw new BaseError(ErrorCode.AUTH_01, 'Học viên chưa đăng nhập');
      }

      const userId = user.id;

      await this.myTutorService.removeFromMyTutor(userId, tutorId);

      res.send_ok('Xóa danh gia sư khỏi sách gia sư yêu thích thành công');
    } catch (error) {
      next(error);
    }
  }
}
