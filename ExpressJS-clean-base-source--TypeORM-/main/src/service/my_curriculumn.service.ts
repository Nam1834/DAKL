import { AddToMyCurriculumnReq } from '@/dto/my-curriculumn/add-to-my-curriculumn.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { MyCurriculumnItem } from '@/models/my-curriculumn-item.model';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { IMyCurriculumnItemRepository } from '@/repository/interface/i.my_curriculumn_item.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMyCurriculumnService } from '@/service/interface/i.my_curriculumn.service';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';

@injectable()
export class MyCurriculumnService
  extends BaseCrudService<MyCurriculumn>
  implements IMyCurriculumnService<MyCurriculumn>
{
  private myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>;
  private myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>;

  constructor(
    @inject('MyCurriculumnRepository') myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>,
    @inject('MyCurriculumnItemRepository') myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>
  ) {
    super(myCurriculumnRepository);
    this.myCurriculumnRepository = myCurriculumnRepository;
    this.myCurriculumnItemRepository = myCurriculumnItemRepository;
  }

  async getMyCurriculumn(userId: string): Promise<MyCurriculumn> {
    const myCurriculumn = await this.myCurriculumnRepository.findOne({
      filter: { userId: userId }
    });

    if (!myCurriculumn) {
      throw new BaseError(ErrorCode.BAD_REQUEST, 'My Currriculumn does not exist');
    }

    const myCurriculumnItem = await this.myCurriculumnItemRepository.findMany({
      filter: {
        myCurriculumnId: myCurriculumn.myCurriculumnId
      },
      relations: ['curriculumn'],
      select: {
        curriculumn: {
          curriculumnId: true,
          curriculumnMajor: true,
          curriculumnName: true,
          curriculumnUrl: true,
          description: true
        }
      }
    });

    myCurriculumn.items = myCurriculumnItem;

    return myCurriculumn;
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

  async removeFromMyCurriculumn() {}
}
