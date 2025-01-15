import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { PagingDto } from '@/dto/paging.dto';
import { CreateValueConfigReq } from '@/dto/value-config/create-value-config.req';
import { UpdateValueConfigReq } from '@/dto/value-config/update-value-config.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { ValueConfig } from '@/models/value_config.model';
import { IValueConfigService } from '@/service/interface/i.value_config.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class ValueConfigController {
  public common: IBaseCrudController<ValueConfig>;
  private valueConfigService: IValueConfigService<ValueConfig>;
  constructor(
    @inject('ValueConfigService') valueConfigService: IValueConfigService<ValueConfig>,
    @inject(ITYPES.Controller) common: IBaseCrudController<ValueConfig>
  ) {
    this.valueConfigService = valueConfigService;
    this.common = common;
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: CreateValueConfigReq = req.body;

      const existingValue = await this.valueConfigService.exists({
        filter: { price: requestBody.price, coinConfig: requestBody.coinConfig }
      });

      if (existingValue) {
        throw new BaseError(ErrorCode.ALREADY_EXISTS, 'Value already exist');
      }

      const result = await this.valueConfigService.create({ data: requestBody });

      res.send_ok('Create value config successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data: UpdateValueConfigReq = req.body;

      if (data.price !== undefined || data.coinConfig !== undefined) {
        const existingValue = await this.valueConfigService.findOne({
          filter: { price: data.price, coinConfig: data.coinConfig }
        });

        if (existingValue && existingValue.valueConfigId !== id) {
          throw new BaseError(ErrorCode.ALREADY_EXISTS, 'Value already exists');
        }
      }

      await this.valueConfigService.updateValueConfig(id, data);

      res.send_ok('Update value config successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteValueConfigById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;

    const existingMajor = await this.valueConfigService.exists({
      filter: { valueConfigId: id }
    });
    if (!existingMajor) {
      throw new BaseError(ErrorCode.DOES_NOT_EXISTS, 'Value Config does not exist');
    }

    await this.valueConfigService.findOneAndDelete({ filter: { valueConfigId: id } });

    res.send_ok('Delete Value Config successfully');
  }

  async getListValueConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const rpp = Number(req.query.rpp) || 10;

      const paging = new PagingDto(page, rpp);

      const value_configs = await this.valueConfigService.getList(paging);

      res.send_ok('Get list value configs success', value_configs);
    } catch (error) {
      next(error);
    }
  }
}
