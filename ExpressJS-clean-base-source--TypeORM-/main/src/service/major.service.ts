import { ErrorCode } from '@/enums/error-code.enums';
import { Major } from '@/models/major.model';
import { IMajorRepository } from '@/repository/interface/i.major.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMajorService } from '@/service/interface/i.major.service';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';

@injectable()
export class MajorService extends BaseCrudService<Major> implements IMajorService<Major> {
  private majorRepository: IMajorRepository<Major>;

  constructor(@inject('MajorRepository') majorRepository: IMajorRepository<Major>) {
    super(majorRepository);
    this.majorRepository = majorRepository;
  }

  async updateMajor(id: string, data: any): Promise<void> {
    const existingMajor = await this.majorRepository.findOne({
      filter: {
        majorId: id
      }
    });

    if (!existingMajor) {
      throw new BaseError(ErrorCode.NF_01, 'Major not found');
    }

    const updateMajor = await this.majorRepository.findOneAndUpdate({
      filter: { majorId: id },
      updateData: data
    });

    return updateMajor;
  }
}
