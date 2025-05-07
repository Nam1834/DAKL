import { ClassroomController } from '@/controller/classroom.controller';
import { ClassroomService } from '@/service/classroom.service';
import { Classroom } from '@/models/classroom.model';
import { ClassroomRepository } from '@/repository/classroom.repository';
import { IClassroomService } from '@/service/interface/i.classroom.service';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { BaseContainer } from '@/container/base.container';

class ClassroomContainer extends BaseContainer {
  constructor() {
    super(Classroom);
    this.container.bind<IClassroomService<Classroom>>('ClassroomService').to(ClassroomService);
    this.container.bind<IClassroomRepository<Classroom>>('ClassroomRepository').to(ClassroomRepository);
    this.container.bind<ClassroomController>(ClassroomController).toSelf();
  }

  export() {
    const classroomController = this.container.get<ClassroomController>(ClassroomController);
    const classroomService = this.container.get<IClassroomService<any>>('ClassroomService');
    const classroomRepository = this.container.get<IClassroomRepository<any>>('ClassroomRepository');

    return { classroomController, classroomService, classroomRepository };
  }
}

const classroomContainer = new ClassroomContainer();
const { classroomController, classroomService, classroomRepository } = classroomContainer.export();
export { classroomController, classroomService, classroomRepository };
