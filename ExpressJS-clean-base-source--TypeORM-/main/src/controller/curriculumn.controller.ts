import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateCurriculumnReq } from '@/dto/curriculumn/create-curriculumn.req';
import { UpdateCurriculumnReq } from '@/dto/curriculumn/update-curriculumn.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { AdminTypeEnum } from '@/enums/admin-type.enum';
import { CurriculumnStatus } from '@/enums/curriculumn-status.eum';
import { ErrorCode } from '@/enums/error-code.enums';
import { Curriculumn } from '@/models/curriculumn.model';
import { ICurriculumnService } from '@/service/interface/i.curriculumn.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { getSearchData } from '@/utils/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { filter } from 'lodash';

@injectable()
export class CurriculumnController {
  public common: IBaseCrudController<Curriculumn>;
  private curriculumnService: ICurriculumnService<Curriculumn>;
  constructor(
    @inject('CurriculumnService') curriculumnService: ICurriculumnService<Curriculumn>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Curriculumn>
  ) {
    this.curriculumnService = curriculumnService;
    this.common = common;
  }

  async searchCurriculumn(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.curriculumnService.search(searchData);
      res.send_ok('Curriculumn fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async createByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admin = req.user;
      const adminId = admin?.id;

      if (!adminId) {
        throw new Error('You must login');
      }

      const data: CreateCurriculumnReq = req.body;

      const result = await this.curriculumnService.createByAdmin(data, adminId);

      res.send_ok('Create curriculumn successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateByAdminById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const existingCurriculumn = await this.curriculumnService.findOne({
        filter: {
          curriculumnId: id
        }
      });

      if (!existingCurriculumn) {
        throw new BaseError(ErrorCode.NF_01, 'Curriculumn not found');
      }
      const data: UpdateCurriculumnReq = req.body;

      const existingCurriculumnName = await this.curriculumnService.findOne({
        filter: { curriculumnName: data.curriculumnName }
      });

      if (existingCurriculumnName) {
        throw new Error(`Curriculumn name "${data.curriculumnName}" already exists!`);
      }

      await this.curriculumnService.findOneAndUpdate({ filter: { curriculumnId: id }, updateData: data });

      res.send_ok('Update major successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteCurriculumnById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;

    const existingMajor = await this.curriculumnService.findOne({
      filter: { curriculumnId: id }
    });
    if (!existingMajor) {
      throw new BaseError(ErrorCode.DOES_NOT_EXISTS, 'Curriculumn does not exist');
    }

    await this.curriculumnService.findOneAndDelete({ filter: { curriculumnId: id } });

    res.send_ok('Delete curriculumn successfully');
  }

  async getListCurriculumn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const rpp = Number(req.query.rpp) || 10;

      const paging = new PagingDto(page, rpp);

      const curriculumns = await this.curriculumnService.getList(paging);

      res.send_ok('Get list curriculumns success', curriculumns);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const curriculumn = await this.curriculumnService.findOne({ filter: { curriculumnId: id } });

      res.send_ok('Get curriculumn success', curriculumn);
    } catch (error) {
      next(error);
    }
  }
}
