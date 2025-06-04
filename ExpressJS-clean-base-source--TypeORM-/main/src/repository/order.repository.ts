import { Order } from '@/models/order.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IOrderRepository } from '@/repository/interface/i.order.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class OrderRepository extends BaseRepository<Order> implements IOrderRepository<Order> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Order));
  }

  async sum(field: keyof Order, filter: any): Promise<number> {
    const qb = this.ormRepository.createQueryBuilder('mp');
    qb.select(`SUM(mp.${field})`, 'sum');

    let paramIndex = 0;
    for (const key in filter) {
      const value = filter[key];

      if (value instanceof Object && value['@instanceof'] === Symbol.for('FindOperator')) {
        const operator = value['_type'];
        const paramName = `param${paramIndex++}`;

        switch (operator) {
          case 'isNull':
            qb.andWhere(`mp.${key} IS NULL`);
            break;
          case 'not':
            qb.andWhere(`mp.${key} != :${paramName}`, { [paramName]: value['_value'] });
            break;
          case 'like':
            qb.andWhere(`mp.${key} LIKE :${paramName}`, { [paramName]: value['_value'] });
            break;
          case 'equal':
            qb.andWhere(`mp.${key} = :${paramName}`, { [paramName]: value['_value'] });
            break;
          case 'between': {
            const [start, end] = value['_value'];
            qb.andWhere(`mp.${key} BETWEEN :${paramName}Start AND :${paramName}End`, {
              [`${paramName}Start`]: start,
              [`${paramName}End`]: end
            });
            break;
          }
          default:
            throw new Error(`Unsupported operator in sum(): ${operator}`);
        }
      } else {
        const paramName = `param${paramIndex++}`;
        qb.andWhere(`mp.${key} = :${paramName}`, { [paramName]: value });
      }
    }

    const result = await qb.getRawOne();
    return Number(result.sum || 0);
  }
}
