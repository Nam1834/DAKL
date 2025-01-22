import { CreateCurriculumnReq } from '@/dto/curriculumn/create-curriculumn.req';
import { GetListCurriculumnRes } from '@/dto/curriculumn/get-list-curriculumn.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { Curriculumn } from '@/models/curriculumn.model';
import { ICurriculumnRepository } from '@/repository/interface/i.curriculumn.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ICurriculumnService } from '@/service/interface/i.curriculumn.service';
import { inject, injectable } from 'inversify';

@injectable()
export class CurriculumnService extends BaseCrudService<Curriculumn> implements ICurriculumnService<Curriculumn> {
  private curriculumnRepository: ICurriculumnRepository<Curriculumn>;

  constructor(@inject('CurriculumnRepository') curriculumnRepository: ICurriculumnRepository<Curriculumn>) {
    super(curriculumnRepository);
    this.curriculumnRepository = curriculumnRepository;
  }

  async getList(paging: PagingDto): Promise<PagingResponseDto<GetListCurriculumnRes>> {
    const curriculumns = await this.curriculumnRepository.findMany({
      paging: paging,
      select: {
        curriculumnId: true,
        curriculumnName: true,
        curriculumnMajor: true,
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
