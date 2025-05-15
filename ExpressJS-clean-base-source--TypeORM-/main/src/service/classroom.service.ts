import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Classroom } from '@/models/classroom.model';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IClassroomService } from '@/service/interface/i.classroom.service';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';

@injectable()
export class ClassroomService extends BaseCrudService<Classroom> implements IClassroomService<Classroom> {
  private classroomRepository: IClassroomRepository<Classroom>;

  constructor(@inject('ClassroomRepository') classroomRepository: IClassroomRepository<Classroom>) {
    super(classroomRepository);
    this.classroomRepository = classroomRepository;
  }

  async getListClassroomForUser(userId: string, searchData: SearchDataDto): Promise<PagingResponseDto<Classroom>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const myClassrooms = await this.classroomRepository.findMany({
      filter: { userId: userId, ...where },
      order: order,
      relations: ['user', 'tutor'],
      paging: paging
    });

    const total = await this.classroomRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, myClassrooms);
  }

  async getListClassroomForTutor(tutorId: string, searchData: SearchDataDto): Promise<PagingResponseDto<Classroom>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const myClassrooms = await this.classroomRepository.findMany({
      filter: { tutorId: tutorId, ...where },
      order: order,
      relations: ['user', 'tutor'],
      paging: paging
    });

    const total = await this.classroomRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, myClassrooms);
  }
}
