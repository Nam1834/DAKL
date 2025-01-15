import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { GetListValueConfigRes } from '@/dto/value-config/get-list-value-config.res';
import { ErrorCode } from '@/enums/error-code.enums';
import { ValueConfig } from '@/models/value_config.model';
import { IValueConfigRepository } from '@/repository/interface/i.value_config.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IValueConfigService } from '@/service/interface/i.value_config.service';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';

@injectable()
export class ValueConfigService extends BaseCrudService<ValueConfig> implements IValueConfigService<ValueConfig> {
  private valueConfigRepository: IValueConfigRepository<ValueConfig>;

  constructor(@inject('ValueConfigRepository') valueConfigRepository: IValueConfigRepository<ValueConfig>) {
    super(valueConfigRepository);
    this.valueConfigRepository = valueConfigRepository;
  }

  async updateValueConfig(id: string, data: any): Promise<void> {
    const existingMajor = await this.valueConfigRepository.findOne({
      filter: {
        valueConfigId: id
      }
    });

    if (!existingMajor) {
      throw new BaseError(ErrorCode.NF_01, 'Value Config not found');
    }

    const updateMajor = await this.valueConfigRepository.findOneAndUpdate({
      filter: { valueConfigId: id },
      updateData: data
    });

    return updateMajor;
  }

  async getList(paging: PagingDto): Promise<PagingResponseDto<GetListValueConfigRes>> {
    const value_configs = await this.valueConfigRepository.findMany({
      paging: paging,
      select: {
        valueConfigId: true,
        price: true,
        coinConfig: true,
        description: true
      }
    });

    const total = await this.valueConfigRepository.count({ filter: {} });

    return {
      items: value_configs,
      total
    };
  }
}
