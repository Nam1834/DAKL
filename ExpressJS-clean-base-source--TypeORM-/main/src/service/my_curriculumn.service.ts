import { AddToMyCurriculumnReq } from '@/dto/my-curriculumn/add-to-my-curriculumn.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { ErrorCode } from '@/enums/error-code.enums';
import { MyCurriculumnItem } from '@/models/my_curriculumn_item.model';
import { MyCurriculumn } from '@/models/my_curriculumn.model';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { IMyCurriculumnItemRepository } from '@/repository/interface/i.my_curriculumn_item.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMyCurriculumnService } from '@/service/interface/i.my_curriculumn.service';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';
import { CreateMyCurriculumnItemReq } from '@/dto/my-curriculumn/create-my-curriculumn-item.req';
import { ICurriculumnRepository } from '@/repository/interface/i.curriculumn.repository';
import { Curriculumn } from '@/models/curriculumn.model';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { TutorProfile } from '@/models/tutor_profile.model';

@injectable()
export class MyCurriculumnService
  extends BaseCrudService<MyCurriculumn>
  implements IMyCurriculumnService<MyCurriculumn>
{
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;
  private curriculumnRepository: ICurriculumnRepository<Curriculumn>;
  private myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>;
  private myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>;

  constructor(
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>,
    @inject('CurriculumnRepository') curriculumnRepository: ICurriculumnRepository<Curriculumn>,
    @inject('MyCurriculumnRepository') myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>,
    @inject('MyCurriculumnItemRepository') myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>
  ) {
    super(myCurriculumnRepository);
    this.myCurriculumnRepository = myCurriculumnRepository;
    this.myCurriculumnItemRepository = myCurriculumnItemRepository;
    this.curriculumnRepository = curriculumnRepository;
    this.tutorProfileRepository = tutorProfileRepository;
  }

  async getMyCurriculumn(userId: string, paging: PagingDto): Promise<PagingResponseDto<MyCurriculumn>> {
    const myCurriculumn = await this.myCurriculumnRepository.findOne({
      filter: { userId: userId }
    });

    if (!myCurriculumn) {
      throw new BaseError(ErrorCode.BAD_REQUEST, 'My Currriculumn does not exist');
    }

    const myCurriculumnItems = await this.myCurriculumnItemRepository.findMany({
      filter: {
        myCurriculumnId: myCurriculumn.myCurriculumnId
      },
      relations: ['curriculumn'],
      paging: paging
    });

    (myCurriculumn as any).items = myCurriculumnItems;

    const total = await this.myCurriculumnItemRepository.count({
      filter: { myCurriculumnId: myCurriculumn.myCurriculumnId }
    });

    return {
      total: total,
      items: [myCurriculumn]
    };
  }

  async addToMyCurrriculumn(userId: string, data: AddToMyCurriculumnReq): Promise<void> {
    const myCurriculumn = await this.myCurriculumnRepository.findOne({
      filter: {
        userId: userId
      }
    });

    if (!myCurriculumn) {
      throw new BaseError(ErrorCode.BAD_REQUEST, 'My Currriculumn does not exist');
    }

    const myCurriculumnItem = new MyCurriculumnItem();
    myCurriculumnItem.curriculumnId = data.curriculumnId;
    myCurriculumnItem.myCurriculumnId = myCurriculumn.myCurriculumnId;

    await this.myCurriculumnItemRepository.create({
      data: myCurriculumnItem
    });
  }

  async removeFromMyCurriculumn(userId: string, curriculumnId: string): Promise<void> {
    const myCurriculumn = await this.myCurriculumnRepository.findOne({
      filter: {
        userId: userId
      }
    });

    if (!myCurriculumn) {
      throw new BaseError(ErrorCode.BAD_REQUEST, 'My Currriculumn does not exist');
    }

    await this.myCurriculumnItemRepository.findOneAndHardDelete({
      filter: {
        curriculumnId: curriculumnId,
        myCurriculumnId: myCurriculumn.myCurriculumnId
      }
    });
  }

  async createMyCurriculumnItem(userId: string, data: CreateMyCurriculumnItemReq): Promise<void> {
    const myCurriculumn = await this.myCurriculumnRepository.findOne({
      filter: {
        userId: userId
      }
    });

    if (!myCurriculumn) {
      throw new BaseError(ErrorCode.BAD_REQUEST, 'My Currriculumn does not exist');
    }

    //More
  }
}
