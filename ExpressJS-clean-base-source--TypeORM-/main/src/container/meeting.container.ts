import { MeetingController } from '@/controller/meeting.controller';
import { MeetingService } from '@/service/meeting.service';
import { Meeting } from '@/models/meeting.model';
import { MeetingRepository } from '@/repository/meeting.repository';
import { IMeetingService } from '@/service/interface/i.meeting.service';
import { IMeetingRepository } from '@/repository/interface/i.meeting.repository';
import { BaseContainer } from '@/container/base.container';
import { IClassroomAssessmentRepository } from '@/repository/interface/i.classroom_assessment.repository';
import { ClassroomAssessment } from '@/models/classroom_assessment.model';
import { classroomAssessmentRepository } from './classroom_assessment.container';

class MeetingContainer extends BaseContainer {
  constructor() {
    super(Meeting);
    this.container.bind<IMeetingService<Meeting>>('MeetingService').to(MeetingService);
    this.container.bind<IMeetingRepository<Meeting>>('MeetingRepository').to(MeetingRepository);
    this.container.bind<MeetingController>(MeetingController).toSelf();

    //Import
    this.container
      .bind<IClassroomAssessmentRepository<ClassroomAssessment>>('ClassroomAssessmentRepository')
      .toConstantValue(classroomAssessmentRepository);
  }

  export() {
    const meetingController = this.container.get<MeetingController>(MeetingController);
    const meetingService = this.container.get<IMeetingService<any>>('MeetingService');
    const meetingRepository = this.container.get<IMeetingRepository<any>>('MeetingRepository');

    return { meetingController, meetingService, meetingRepository };
  }
}

const meetingContainer = new MeetingContainer();
const { meetingController, meetingService, meetingRepository } = meetingContainer.export();
export { meetingController, meetingService, meetingRepository };
