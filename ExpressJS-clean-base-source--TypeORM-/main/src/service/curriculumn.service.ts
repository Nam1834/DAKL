import { CreateCurriculumnReq } from '@/dto/curriculumn/create-curriculumn.req';
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

  async createCurriculumnByTutor(data: CreateCurriculumnReq): Promise<void> {}
}
