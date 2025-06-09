import { ManageBanking } from '@/models/manage_banking.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { IManageBankingRepository } from '@/repository/interface/i.manage_banking.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class ManageBankingRepository
  extends BaseRepository<ManageBanking>
  implements IManageBankingRepository<ManageBanking>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(ManageBanking));
  }
}
