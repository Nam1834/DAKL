import { AddToMyTutorReq } from '@/dto/my-tutor/add-to-my-tutor.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { MyTutor } from '@/models/my_tutor.model';
import { MyTutorItem } from '@/models/my_tutor_item.model';
import { IMyTutorRepository } from '@/repository/interface/i.my_tutor.repository';
import { IMyTutorItemRepository } from '@/repository/interface/i.my_tutor_item.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMyTutorService } from '@/service/interface/i.my_tutor.service';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';

@injectable()
export class MyTutorService extends BaseCrudService<MyTutor> implements IMyTutorService<MyTutor> {
  private myTutorRepository: IMyTutorRepository<MyTutor>;
  private myTutorItemRepository: IMyTutorItemRepository<MyTutorItem>;

  constructor(
    @inject('MyTutorRepository') myTutorRepository: IMyTutorRepository<MyTutor>,
    @inject('MyTutorItemRepository') myTutorItemRepository: IMyTutorItemRepository<MyTutorItem>
  ) {
    super(myTutorRepository);
    this.myTutorRepository = myTutorRepository;
    this.myTutorItemRepository = myTutorItemRepository;
  }

  async getMyTutor(userId: string): Promise<MyTutor> {
    const myTutor = await this.myTutorRepository.findOne({
      filter: {
        userId: userId
      }
    });

    if (!myTutor) {
      throw new BaseError(ErrorCode.BAD_REQUEST, 'Không tồn tại danh sách gia sư yêu thích');
    }

    const myTutorItems = await this.myTutorItemRepository.findMany({
      filter: {
        myTutorId: myTutor.myTutorId
      }
    });

    myTutorItems.forEach((tutor) => {
      delete (tutor as any).password;
    });

    myTutor.items = myTutorItems;

    return myTutor;
  }

  async removeFromMyTutor(userId: string, tutorId: string): Promise<void> {
    const myTutor = await this.myTutorRepository.findOne({
      filter: {
        userId: userId
      }
    });

    if (!myTutor) {
      throw new BaseError(ErrorCode.BAD_REQUEST, 'Không tồn tại danh sách gia sư yêu thích');
    }

    await this.myTutorItemRepository.findOneAndHardDelete({
      filter: {
        tutorId: tutorId,
        myTutorId: myTutor.myTutorId
      }
    });
  }

  /**
   * * Add new course to cart
   * @param studentId
   * @param data
   */
  async addToMyTutor(userId: string, data: AddToMyTutorReq): Promise<void> {
    const myTutor = await this.myTutorRepository.findOne({
      filter: {
        userId: userId
      }
    });

    if (!myTutor) {
      throw new BaseError(ErrorCode.BAD_REQUEST, 'Không tồn tại danh sách gia sư yêu thích');
    }

    const myTutorItem = new MyTutorItem();
    myTutorItem.tutorId = data.tutorId;
    myTutorItem.myTutorId = myTutor.myTutorId;

    await this.myTutorItemRepository.create({
      data: myTutorItem
    });
  }
}
