import { PagingDto } from '@/dto/paging.dto';
import { ErrorCode } from '@/enums/error-code.enums';
import { IBaseRepository } from '@/repository/interface/i.base.repository';
import { ITYPES } from '@/types/interface.types';
import { RecordOrderType } from '@/types/record-order.types';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DeepPartial, FindOptionsSelect, FindOptionsWhere, IsNull, ObjectLiteral, Repository } from 'typeorm';

@injectable()
export class BaseRepository<T extends ObjectLiteral> implements IBaseRepository<T> {
  protected ormRepository!: Repository<T>;

  constructor(
    @inject(ITYPES.OrmRepository)
    ormRepository: Repository<T>
  ) {
    this.ormRepository = ormRepository;
  }

  private hasDeleteAtColumn(): boolean {
    return this.ormRepository.metadata.columns.some((column) => column.propertyName === 'deletedAt');
  }

  createOrderCondition(key: string, direction: 'ASC' | 'DESC'): any {
    const orderCondition: any = {};
    const keys = key.split('.');

    if (keys.length === 1) {
      return { [key]: direction };
    }

    let temp = orderCondition;
    for (let i = 0; i < keys.length - 1; i++) {
      temp[keys[i]] = {};
      temp = temp[keys[i]];
    }

    temp[keys[keys.length - 1]] = direction;

    return orderCondition;
  }

  async save(data: T): Promise<T> {
    return await this.ormRepository.save(data);
  }

  async create(payload: { data: DeepPartial<T> }): Promise<T> {
    const data = payload.data;
    const result = await this.ormRepository.save(data);
    return result;
  }

  async findOneAndDelete(options: { filter: Partial<T> }): Promise<void> {
    const { filter } = options;
    const recordToDelete = await this.ormRepository.findOne({
      where: filter
    });
    if (!recordToDelete) {
      throw new BaseError(ErrorCode.NF_01, 'Record not found with given filter: ' + JSON.stringify(filter));
    }
    (recordToDelete as any).deletedAt = new Date();
    await this.ormRepository.save(recordToDelete);
  }

  async findOneAndHardDelete(options: { filter: Partial<T> }): Promise<void> {
    const { filter } = options;
    const recordToDelete = await this.ormRepository.findOne({
      where: filter
    });
    if (!recordToDelete) {
      throw new BaseError(ErrorCode.NF_01, 'Record not found with given filter: ' + JSON.stringify(filter));
    }
    await this.ormRepository.delete(filter);
  }

  async findOneAndUpdate(options: { filter: Partial<T>; updateData: Partial<T> }): Promise<void> {
    const { filter, updateData } = options;

    if (this.hasDeleteAtColumn()) {
      if (filter && !filter.deletedAt) {
        (filter as any).deletedAt = IsNull();
      }
    }

    const recordToUpdate = await this.ormRepository.findOne({
      where: filter
    });

    if (!recordToUpdate) {
      throw new BaseError(ErrorCode.NF_01, 'Record not found with given filter: ' + JSON.stringify(filter));
    }

    const primaryKey = await this.ormRepository.getId(recordToUpdate);

    await this.ormRepository.update(primaryKey, updateData);
  }

  async findOne(options: {
    filter: Partial<T>;
    relations?: string[];
    select?: FindOptionsSelect<T>;
  }): Promise<T | null> {
    const { filter, relations, select } = options;

    if (this.hasDeleteAtColumn()) {
      if (!filter.deletedAt) {
        (filter as any).deletedAt = IsNull();
      }
    }

    const result = await this.ormRepository.findOne({
      where: filter,
      relations: relations,
      select: select
    });

    return result;
  }

  async findMany(options: {
    filter?: Partial<T>;
    paging?: PagingDto;
    order?: RecordOrderType[];
    relations?: string[];
    select?: FindOptionsSelect<T>;
  }): Promise<T[]> {
    const { paging, order, relations, select } = options;
    let { filter } = options;

    let skip = undefined;
    let take = undefined;
    if (paging) {
      skip = (paging.page - 1) * paging.rpp;
      take = paging.rpp;
    }

    if (this.hasDeleteAtColumn()) {
      if (filter && !filter.deletedAt) {
        (filter as any).deletedAt = IsNull();
      }

      if (!filter) {
        (filter as any) = {
          deletedAt: IsNull()
        };
      }
    }

    const orderObject: Record<string, 'ASC' | 'DESC'> = {};

    if (order) {
      order.forEach((o) => {
        //orderObject[o.column] = o.direction;
        const orderCondition = this.createOrderCondition(o.column, o.direction);
        Object.assign(orderObject, orderCondition);
      });
    }
    const result = await this.ormRepository.find({
      where: filter,
      take: take,
      skip: skip,
      order: orderObject as any,
      relations: relations,
      select: select
    });
    return result;
  }

  async findToSearchAll(options: {
    filter?: FindOptionsWhere<T>[]; // giữ dạng mảng => OR
    paging?: PagingDto;
    order?: RecordOrderType[];
    relations?: string[];
    select?: FindOptionsSelect<T>;
  }): Promise<T[]> {
    const { filter = [], paging, order, relations, select } = options;

    let whereCondition: FindOptionsWhere<T>[] = filter;

    // Đồng bộ xử lý deletedAt
    if (this.hasDeleteAtColumn()) {
      const deletedAtCondition = { deletedAt: IsNull() } as unknown as FindOptionsWhere<T>;

      if (whereCondition.length === 0) {
        whereCondition = [deletedAtCondition];
      } else {
        whereCondition = whereCondition.map((f) => ({
          ...f,
          deletedAt: (f as any).deletedAt ?? IsNull()
        }));
      }
    }

    let skip = undefined;
    let take = undefined;
    if (paging) {
      skip = (paging.page - 1) * paging.rpp;
      take = paging.rpp;
    }

    const orderObject: Record<string, 'ASC' | 'DESC'> = {};
    if (order) {
      order.forEach((o) => {
        const orderCondition = this.createOrderCondition(o.column, o.direction);
        Object.assign(orderObject, orderCondition);
      });
    }

    const result = await this.ormRepository.find({
      where: whereCondition as any, // ép kiểu thành any
      take,
      skip,
      order: orderObject as any,
      relations,
      select
    });

    return result;
  }

  async findAll(): Promise<T[]> {
    const filter: Partial<T> = {};
    if (this.hasDeleteAtColumn()) {
      (filter as any).deletedAt = IsNull();
    }

    return await this.ormRepository.find({
      where: filter
    });
  }

  async count(options: { filter?: Partial<T> }): Promise<number> {
    let { filter } = options;

    if (this.hasDeleteAtColumn()) {
      if (filter && !filter.deletedAt) {
        (filter as any).deletedAt = IsNull();
      }

      if (!filter) {
        (filter as any) = {
          deletedAt: IsNull()
        };
      }
    }

    return await this.ormRepository.count({
      where: filter
    });
  }

  async exists(options: { filter: Partial<T> }): Promise<boolean> {
    const { filter } = options;

    if (this.hasDeleteAtColumn()) {
      if (filter && !filter.deletedAt) {
        (filter as any).deletedAt = IsNull();
      }
    }

    const total = await this.ormRepository.count({
      where: filter
    });
    return total > 0;
  }
}
