import { CreateCurriculumnReq } from '@/dto/curriculumn/create-curriculumn.req';
import { GetListCurriculumnRes } from '@/dto/curriculumn/get-list-curriculumn.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Admin } from '@/models/admin.model';
import { Curriculumn } from '@/models/curriculumn.model';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { ICurriculumnRepository } from '@/repository/interface/i.curriculumn.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ICurriculumnService } from '@/service/interface/i.curriculumn.service';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class CurriculumnService extends BaseCrudService<Curriculumn> implements ICurriculumnService<Curriculumn> {
  private curriculumnRepository: ICurriculumnRepository<Curriculumn>;
  private adminRepository: IAdminRepository<Admin>;

  constructor(
    @inject('CurriculumnRepository') curriculumnRepository: ICurriculumnRepository<Curriculumn>,
    @inject('AdminRepository') adminRepository: IAdminRepository<Admin>
  ) {
    super(curriculumnRepository);
    this.curriculumnRepository = curriculumnRepository;
    this.adminRepository = adminRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<Curriculumn>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const curriculumns = await this.curriculumnRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.curriculumnRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, curriculumns);
  }

  async searchForTutor(searchData: SearchDataDto): Promise<PagingResponseDto<Curriculumn>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const curriculumns = await this.curriculumnRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.curriculumnRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, curriculumns);
  }

  async createByAdmin(data: CreateCurriculumnReq, adminId: string): Promise<void> {
    const admin = await this.adminRepository.findOne({
      filter: { adminId: adminId }
    });

    if (!admin) {
      throw new Error('Can not find Admin!');
    }

    const existingCurriculumn = await this.curriculumnRepository.findOne({
      filter: { curriculumnName: data.curriculumnName }
    });

    if (existingCurriculumn) {
      throw new Error(`Curriculumn name "${data.curriculumnName}" already exists!`);
    }

    const newCurriculumn = new Curriculumn();
    newCurriculumn.curriculumnName = data.curriculumnName;
    newCurriculumn.majorId = data.majorId;
    newCurriculumn.subjectId = data.subjectId;
    newCurriculumn.curriculumnUrl = data.curriculumnUrl;
    newCurriculumn.description = data.description;
    newCurriculumn.status = data.status;
    newCurriculumn.roleUserCreated = admin.roleId;

    await this.curriculumnRepository.createNewCurriculumn(newCurriculumn);

    await this.curriculumnRepository.save(newCurriculumn);
  }

  async getList(paging: PagingDto): Promise<PagingResponseDto<GetListCurriculumnRes>> {
    const curriculumns = await this.curriculumnRepository.findMany({
      paging: paging,
      select: {
        curriculumnId: true,
        curriculumnName: true,
        majorId: true,
        subjectId: true,
        status: true,
        roleUserCreated: true
      }
    });

    const total = await this.curriculumnRepository.count({ filter: {} });

    return {
      items: curriculumns,
      total
    };
  }

  async createCurriculumnByTutor(data: CreateCurriculumnReq): Promise<void> {}
}
