import { ManagePayment } from '@/models/manage_payment.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IManagePaymentRepository } from '@/repository/interface/i.manage_payment.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ManagePaymentRepository
  extends BaseRepository<ManagePayment>
  implements IManagePaymentRepository<ManagePayment>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ManagePayment));
  }

  async sum(field: keyof ManagePayment, filter: any): Promise<number> {
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
          case 'between':
            qb.andWhere(`mp.${key} BETWEEN :${paramName}_start AND :${paramName}_end`, {
              [`${paramName}_start`]: value['_value'][0],
              [`${paramName}_end`]: value['_value'][1]
            });
            break;
          // Add other operators if needed
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
