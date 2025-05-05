import { IStatisticalRepository } from '@/repository/interface/i.statistical.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IStatisticalService } from '@/service/interface/i.statistical.service';
import { inject, injectable } from 'inversify';

@injectable()
export class StatisticalService implements IStatisticalService {
  private statisticalRepository: IStatisticalRepository;

  constructor(@inject('StatisticalRepository') statisticalRepository: IStatisticalRepository) {
    this.statisticalRepository = statisticalRepository;
  }
}
