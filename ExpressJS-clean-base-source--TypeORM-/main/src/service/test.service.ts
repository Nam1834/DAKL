import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Test } from '@/models/test.model';
import { ITestRepository } from '@/repository/interface/i.test.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ITestService } from '@/service/interface/i.test.service';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class TestService extends BaseCrudService<Test> implements ITestService<Test> {
  private testRepository: ITestRepository<Test>;

  constructor(@inject('TestRepository') testRepository: ITestRepository<Test>) {
    super(testRepository);
    this.testRepository = testRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<Test>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const test = await this.testRepository.findMany({
      filter: where,
      order: order,
      relations: ['questions'],
      select: {
        questions: {
          testQuestionId: true,
          questionNumber: true,
          questionText: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true
        }
      },
      paging: paging
    });

    const total = await this.testRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, test);
  }
}
