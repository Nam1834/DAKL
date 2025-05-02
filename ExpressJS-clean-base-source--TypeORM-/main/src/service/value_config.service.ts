import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { CreateValueConfigReq } from '@/dto/value-config/create-value-config.req';
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

  async createValueConfig(data: CreateValueConfigReq): Promise<void> {
    const newValueConfig = new ValueConfig();
    newValueConfig.price = data.price;
    newValueConfig.coinConfig = data.coinConfig;
    newValueConfig.urlConfig = data.urlConfig;
    newValueConfig.description = data.description;

    // Gọi repository để tạo majorId
    await this.valueConfigRepository.createNewValueConfig(newValueConfig);

    // Lưu vào database
    await this.valueConfigRepository.save(newValueConfig);
  }

  async updateValueConfig(id: string, data: any): Promise<void> {
    const value_config = await this.valueConfigRepository.findOne({
      filter: {
        valueConfigId: id
      }
    });

    if (!value_config) {
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
        description: true,
        urlConfig: true
      }
    });

    const total = await this.valueConfigRepository.count({ filter: {} });

    return {
      items: value_configs,
      total
    };
  }
}
