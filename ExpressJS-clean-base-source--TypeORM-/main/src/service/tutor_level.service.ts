import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ErrorCode } from '@/enums/error-code.enums';
import { TutorLevel } from '@/models/tutor_level.model';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITutorLevelService } from '@/service/interface/i.tutor_level.service';
import BaseError from '@/utils/error/base.error';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorLevelService extends BaseCrudService<TutorLevel> implements ITutorLevelService<TutorLevel> {
  private tutorLevelRepository: ITutorLevelRepository<TutorLevel>;

  constructor(@inject('TutorLevelRepository') tutorLevelRepository: ITutorLevelRepository<TutorLevel>) {
    super(tutorLevelRepository);
    this.tutorLevelRepository = tutorLevelRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<TutorLevel>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const majors = await this.tutorLevelRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.tutorLevelRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, majors);
  }

  async updateTutorLevel(id: string, data: any): Promise<void> {
    const existingTutorLevel = await this.tutorLevelRepository.findOne({
      filter: {
        tutorLevelId: id
      }
    });

    if (!existingTutorLevel) {
      throw new BaseError(ErrorCode.NF_01, 'Tutor level not found');
    }

    const updateMajor = await this.tutorLevelRepository.findOneAndUpdate({
      filter: { tutorLevelId: id },
      updateData: data
    });

    return updateMajor;
  }
}
