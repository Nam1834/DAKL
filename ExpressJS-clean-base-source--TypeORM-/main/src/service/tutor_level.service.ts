import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { CreateTutorLevelReq } from '@/dto/tutor-level/create-tutor-level.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { TutorLevel } from '@/models/tutor_level.model';
import { TutorProfile } from '@/models/tutor_profile.model';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITutorLevelService } from '@/service/interface/i.tutor_level.service';
import BaseError from '@/utils/error/base.error';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorLevelService extends BaseCrudService<TutorLevel> implements ITutorLevelService<TutorLevel> {
  private tutorLevelRepository: ITutorLevelRepository<TutorLevel>;
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;

  constructor(
    @inject('TutorLevelRepository') tutorLevelRepository: ITutorLevelRepository<TutorLevel>,
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>
  ) {
    super(tutorLevelRepository);
    this.tutorLevelRepository = tutorLevelRepository;
    this.tutorProfileRepository = tutorProfileRepository;
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

  async createTutorLevel(data: CreateTutorLevelReq): Promise<void> {
    const newTutorLevel = new TutorLevel();
    newTutorLevel.levelName = data.levelName;
    newTutorLevel.salary = data.salary;
    newTutorLevel.description = data.description;

    // Gọi repository
    await this.tutorLevelRepository.createNewTutorLevel(newTutorLevel);

    // Lưu vào database
    await this.tutorLevelRepository.save(newTutorLevel);
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

    const updateTutorLevel = await this.tutorLevelRepository.findOneAndUpdate({
      filter: { tutorLevelId: id },
      updateData: data
    });

    return updateTutorLevel;
  }

  async deleteTutorLevelById(id: string): Promise<void> {
    const existingTutorLevel = await this.tutorLevelRepository.findOne({
      filter: {
        tutorLevelId: id
      }
    });

    if (!existingTutorLevel) {
      throw new Error('Tutor level not found');
    }

    const checkTutorUsing = await this.tutorProfileRepository.findOne({
      filter: { tutorLevelId: id }
    });

    if (checkTutorUsing) {
      throw new Error('Can not delete Tutor Level because had Tutor used it!');
    }

    await this.tutorLevelRepository.findOneAndDelete({
      filter: { tutorLevelId: id }
    });
  }
}
