import { Classroom } from '@/models/classroom.model';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IClassroomService } from '@/service/interface/i.classroom.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ClassroomService extends BaseCrudService<Classroom> implements IClassroomService<Classroom> {
  private classroomRepository: IClassroomRepository<Classroom>;

  constructor(@inject('ClassroomRepository') classroomRepository: IClassroomRepository<Classroom>) {
    super(classroomRepository);
    this.classroomRepository = classroomRepository;
  }
}
