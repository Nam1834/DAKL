import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { CreateSubjectReq } from '@/dto/subject/create-subject.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { Subject } from '@/models/subject.model';
import { ISubjectRepository } from '@/repository/interface/i.subject.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { ISubjectService } from '@/service/interface/i.subject.service';
import BaseError from '@/utils/error/base.error';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class SubjectService extends BaseCrudService<Subject> implements ISubjectService<Subject> {
  private subjectRepository: ISubjectRepository<Subject>;

  constructor(@inject('SubjectRepository') subjectRepository: ISubjectRepository<Subject>) {
    super(subjectRepository);
    this.subjectRepository = subjectRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<Subject>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const majors = await this.subjectRepository.findMany({
      filter: where,
      order: order,
      paging: paging
    });

    const total = await this.subjectRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, majors);
  }

  async createSubject(data: CreateSubjectReq): Promise<void> {
    const newSubject = new Subject();
    newSubject.subjectName = data.subjectName;
    newSubject.majorId = data.majorId;

    // Gọi repository để tạo majorId
    await this.subjectRepository.createNewSubject(newSubject);

    // Lưu vào database
    await this.subjectRepository.save(newSubject);
  }

  async updateSubject(id: string, data: any): Promise<void> {
    const existingSubject = await this.subjectRepository.findOne({
      filter: {
        subjectId: id
      }
    });

    if (!existingSubject) {
      throw new BaseError(ErrorCode.NF_01, 'Subject not found');
    }

    const updateMajor = await this.subjectRepository.findOneAndUpdate({
      filter: { subjectId: id },
      updateData: data
    });

    return updateMajor;
  }
}
