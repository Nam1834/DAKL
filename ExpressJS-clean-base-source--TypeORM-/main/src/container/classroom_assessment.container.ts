import { ClassroomAssessmentController } from '@/controller/classroom_assessment.controller';
import { ClassroomAssessmentService } from '@/service/classroom_assessment.service';
import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { ClassroomAssessmentRepository } from '@/repository/classroom_assessment.repository';
import { IClassroomAssessmentService } from '@/service/interface/i.classroom_assessment.service';
import { IClassroomAssessmentRepository } from '@/repository/interface/i.classroom_assessment.repository';
import { BaseContainer } from '@/container/base.container';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { classroomRepository } from './classroom.container';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { tutorProfileRepository } from './tutor_profile.container';
import { ClassroomRepository } from '@/repository/classroom.repository';

class ClassroomAssessmentContainer extends BaseContainer {
  constructor() {
    super(ClassroomAssessment);
    this.container
      .bind<IClassroomAssessmentService<ClassroomAssessment>>('ClassroomAssessmentService')
      .to(ClassroomAssessmentService);
    this.container
      .bind<IClassroomAssessmentRepository<ClassroomAssessment>>('ClassroomAssessmentRepository')
      .to(ClassroomAssessmentRepository);
    this.container.bind<ClassroomAssessmentController>(ClassroomAssessmentController).toSelf();

    //Import
    this.container.bind<IClassroomRepository<any>>('ClassroomRepository').to(ClassroomRepository);
    this.container.bind<ITutorProfileRepository<any>>('TutorProfileRepository').toConstantValue(tutorProfileRepository);
  }

  export() {
    const classroomAssessmentController =
      this.container.get<ClassroomAssessmentController>(ClassroomAssessmentController);
    const classroomAssessmentService =
      this.container.get<IClassroomAssessmentService<any>>('ClassroomAssessmentService');
    const classroomAssessmentRepository = this.container.get<IClassroomAssessmentRepository<any>>(
      'ClassroomAssessmentRepository'
    );

    return { classroomAssessmentController, classroomAssessmentService, classroomAssessmentRepository };
  }
}

const classroomAssessmentContainer = new ClassroomAssessmentContainer();
const { classroomAssessmentController, classroomAssessmentService, classroomAssessmentRepository } =
  classroomAssessmentContainer.export();
export { classroomAssessmentController, classroomAssessmentService, classroomAssessmentRepository };
