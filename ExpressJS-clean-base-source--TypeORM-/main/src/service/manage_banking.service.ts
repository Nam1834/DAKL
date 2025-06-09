import { CreateManageBankingReq } from '@/dto/manage-banking/create-manage-banking.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ErrorCode } from '@/enums/error-code.enums';
import { ManageBankingStatus } from '@/enums/manage-banking-status.enum';
import { ManageBanking } from '@/models/manage_banking.model';
import { User } from '@/models/user.model';
import { IManageBankingRepository } from '@/repository/interface/i.manage_banking.repository';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IManageBankingService } from '@/service/interface/i.manage_banking.service';
import BaseError from '@/utils/error/base.error';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class ManageBankingService
  extends BaseCrudService<ManageBanking>
  implements IManageBankingService<ManageBanking>
{
  private manageBankingRepository: IManageBankingRepository<ManageBanking>;
  private userRepository: IUserRepository<User>;

  constructor(
    @inject('ManageBankingRepository') manageBankingRepository: IManageBankingRepository<ManageBanking>,
    @inject('UserRepository') userRepository: IUserRepository<User>
  ) {
    super(manageBankingRepository);
    this.manageBankingRepository = manageBankingRepository;
    this.userRepository = userRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<ManageBanking>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const manageBankings = await this.manageBankingRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.manageBankingRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, manageBankings);
  }

  async getMyManageBanking(tutorId: string, searchData: SearchDataDto): Promise<PagingResponseDto<ManageBanking>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const manageBankings = await this.manageBankingRepository.findMany({
      filter: { tutorId: tutorId, ...where },
      order: order,
      paging: paging
    });

    const total = await this.manageBankingRepository.count({
      filter: { tutorId: tutorId, ...where }
    });

    return new PagingResponseDto(total, manageBankings);
  }

  async createManageBanking(tutorId: string, data: CreateManageBankingReq): Promise<void> {
    const user = await this.userRepository.findOne({
      filter: { userId: tutorId }
    });
    if (!user) {
      throw new BaseError(ErrorCode.NF_01, 'Không tìm thấy thông tin người dùng');
    }
    const userCoins = user.coin;
    if (!data.coinWithdraw) {
      throw new Error('You must insert coinWithdraw!');
    }

    if (userCoins < data.coinWithdraw) {
      throw new Error('You does not enough coin!');
    }

    const manageBanking = new ManageBanking();
    manageBanking.tutorId = tutorId;
    manageBanking.coinWithdraw = data.coinWithdraw;
    manageBanking.gotValue = data.coinWithdraw * 1000;

    await this.manageBankingRepository.create({
      data: manageBanking
    });
  }

  async solveManageBanking(click: string, manageBankingId: string, description?: string): Promise<void> {
    const manageBanking = await this.manageBankingRepository.findOne({
      filter: { manageBankingId: manageBankingId, status: ManageBankingStatus.REQUEST }
    });

    if (!manageBanking) {
      throw new Error('You can not solve this manage banking!');
    }

    if (click === ManageBankingStatus.ACCEPT) {
      const updatedManageBanking = new ManageBanking();
      updatedManageBanking.status = ManageBankingStatus.ACCEPT;
      updatedManageBanking.description = 'Chúc mừng bạn đã rút xu thành công';

      await this.manageBankingRepository.findOneAndUpdate({
        filter: { manageBankingId: manageBankingId },
        updateData: updatedManageBanking
      });

      const user = await this.userRepository.findOne({
        filter: { userId: manageBanking.tutorId }
      });

      if (!user) {
        throw new Error('Can not find userr!');
      }

      const coinOfUser = user.coin;

      if (coinOfUser < manageBanking.coinWithdraw) {
        throw new Error('This tutor does not enough coin!');
      }

      const coinIfWithDraw = coinOfUser - manageBanking.coinWithdraw;

      await this.userRepository.findOneAndUpdate({
        filter: { userId: manageBanking.tutorId },
        updateData: { coin: coinIfWithDraw }
      });
    } else if (click === ManageBankingStatus.REFUSE || click === ManageBankingStatus.CANCEL) {
      if (!description) {
        throw new Error('description is required for REFUSE or CANCEL status!');
      }
      const updatedManageBanking = new ManageBanking();
      updatedManageBanking.status = ManageBankingStatus.REFUSE;
      updatedManageBanking.description = description;

      await this.manageBankingRepository.findOneAndUpdate({
        filter: { manageBankingId: manageBankingId },
        updateData: updatedManageBanking
      });
    }
  }

  async cancelManageBankingByTutor(tutorId: string, manageBankingId: string): Promise<void> {
    const manageBanking = await this.manageBankingRepository.findOne({
      filter: { manageBankingId: manageBankingId, tutorId: tutorId, status: ManageBankingStatus.REQUEST }
    });

    if (!manageBanking) {
      throw new Error('You can not solve this manage banking!');
    }

    const updatedManageBanking = new ManageBanking();
    updatedManageBanking.status = ManageBankingStatus.CANCEL;
    updatedManageBanking.description = 'Yêu cầu này đã bị bạn hủy';

    await this.manageBankingRepository.findOneAndUpdate({
      filter: { manageBankingId: manageBankingId },
      updateData: updatedManageBanking
    });
  }
}
