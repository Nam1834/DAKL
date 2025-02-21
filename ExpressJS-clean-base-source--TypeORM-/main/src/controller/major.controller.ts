import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateMajorReq } from '@/dto/major/create-major.req';
import { PagingDto } from '@/dto/paging.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ErrorCode } from '@/enums/error-code.enums';
import { Major } from '@/models/major.model';
import { IMajorService } from '@/service/interface/i.major.service';
import { ITYPES } from '@/types/interface.types';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import BaseError from '@/utils/error/base.error';
import { getSearchData } from '@/utils/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class MajorController {
  public common: IBaseCrudController<Major>;
  private majorService: IMajorService<Major>;
  constructor(
    @inject('MajorService') majorService: IMajorService<Major>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Major>
  ) {
    this.majorService = majorService;
    this.common = common;
  }

  async searchMajor(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.majorService.search(searchData);
      res.send_ok('Major fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: CreateMajorReq = req.body;

      const existingMajor = await this.majorService.findOne({
        filter: { majorId: requestBody.majorId }
      });

      if (existingMajor) {
        throw new BaseError(ErrorCode.ALREADY_EXISTS, 'Major already exist');
      }

      const result = await this.majorService.create({ data: requestBody });

      res.send_ok('Create major successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data: CreateMajorReq = req.body;

      await this.majorService.updateMajor(id, data);

      res.send_ok('Update major successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteMajorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;

    const existingMajor = await this.majorService.findOne({
      filter: { majorId: id }
    });
    if (!existingMajor) {
      throw new BaseError(ErrorCode.DOES_NOT_EXISTS, 'Major does not exist');
    }

    await this.majorService.findOneAndDelete({ filter: { majorId: id } });

    res.send_ok('Delete major successfully');
  }

  async getListMajor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const rpp = Number(req.query.rpp) || 10;

      const paging = new PagingDto(page, rpp);

      const majors = await this.majorService.getList(paging);

      res.send_ok('Get list majors success', majors);
    } catch (error) {
      next(error);
    }
  }
}
