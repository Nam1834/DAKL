import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { CreateTutorLevelReq } from '@/dto/tutor-level/create-tutor-level.req';
import { UpdateTutorLevelReq } from '@/dto/tutor-level/update-tutor-level.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { TutorLevel } from '@/models/tutor_level.model';
import { ITutorLevelService } from '@/service/interface/i.tutor_level.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { getSearchData } from '@/utils/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorLevelController {
  public common: IBaseCrudController<TutorLevel>;
  private tutorLevelService: ITutorLevelService<TutorLevel>;
  constructor(
    @inject('TutorLevelService') tutorLevelService: ITutorLevelService<TutorLevel>,
    @inject(ITYPES.Controller) common: IBaseCrudController<TutorLevel>
  ) {
    this.tutorLevelService = tutorLevelService;
    this.common = common;
  }

  async searchTutorLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.tutorLevelService.search(searchData);
      res.send_ok('Tutor level fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: CreateTutorLevelReq = req.body;

      const result = await this.tutorLevelService.createTutorLevel(requestBody);

      res.send_ok('Create Tutor level successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data: UpdateTutorLevelReq = req.body;

      await this.tutorLevelService.updateTutorLevel(id, data);

      res.send_ok('Update tutor level successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteTutorLevelById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;

    const existingTutorLevel = await this.tutorLevelService.findOne({
      filter: { tutorLevelId: id }
    });
    if (!existingTutorLevel) {
      throw new BaseError(ErrorCode.DOES_NOT_EXISTS, 'Tutor Level does not exist');
    }

    await this.tutorLevelService.findOneAndDelete({ filter: { tutorLevelId: id } });

    res.send_ok('Delete tutor level successfully');
  }
}
