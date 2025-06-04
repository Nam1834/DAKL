import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ClassroomStatus } from '@/enums/classroom-status.enum';
import { Classroom } from '@/models/classroom.model';
import { Meeting } from '@/models/meeting.model';
import { IClassroomRepository } from '@/repository/interface/i.classroom.repository';
import { IMeetingRepository } from '@/repository/interface/i.meeting.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IClassroomService } from '@/service/interface/i.classroom.service';
import { SearchUtil } from '@/utils/search.util';
import { inject, injectable } from 'inversify';
import { In } from 'typeorm';

@injectable()
export class ClassroomService extends BaseCrudService<Classroom> implements IClassroomService<Classroom> {
  private classroomRepository: IClassroomRepository<Classroom>;
  private meetingRepository: IMeetingRepository<Meeting>;

  constructor(
    @inject('ClassroomRepository') classroomRepository: IClassroomRepository<Classroom>,
    @inject('MeetingRepository') meetingRepository: IMeetingRepository<Meeting>
  ) {
    super(classroomRepository);
    this.classroomRepository = classroomRepository;
    this.meetingRepository = meetingRepository;
  }

  async getListClassroomForUser(userId: string, searchData: SearchDataDto): Promise<PagingResponseDto<Classroom>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const myClassrooms = await this.classroomRepository.findMany({
      filter: { userId: userId, ...where },
      order: order,
      relations: ['user', 'tutor'],
      paging: paging
    });

    const classroomIds = myClassrooms.map((classroom) => classroom.classroomId);

    // Gắn mặc định isMeeted = false
    myClassrooms.forEach((classroom) => {
      classroom.isMeeted = false;
    });

    if (classroomIds.length > 0) {
      const relatedMeetings = await this.meetingRepository.findMeetingsByClassroomIds(classroomIds);

      const meetingMap = new Map<string, Meeting>();
      relatedMeetings.forEach((meeting) => {
        if (meeting.classroomId) {
          meetingMap.set(meeting.classroomId, meeting);
        }
      });

      myClassrooms.forEach((classroom) => {
        if (meetingMap.has(classroom.classroomId)) {
          classroom.isMeeted = true;
        }
      });
    }

    const now = new Date();
    const endedClassroomIds: string[] = [];

    myClassrooms.forEach((classroom) => {
      const endDayDate = new Date(classroom.endDay);
      if (endDayDate < now && classroom.status !== ClassroomStatus.ENDED) {
        classroom.status = ClassroomStatus.ENDED;
        endedClassroomIds.push(classroom.classroomId);
      }
    });

    console.log('Updating classrooms:', classroomIds);

    // Cập nhật DB nếu có lớp học đã kết thúc
    if (endedClassroomIds.length > 0) {
      await this.classroomRepository.updateManyStatus(endedClassroomIds, ClassroomStatus.ENDED);
    }

    console.log('Ended classroom IDs:', endedClassroomIds);

    const total = await this.classroomRepository.count({
      filter: { userId: userId, ...where }
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

    const classroomIds = myClassrooms.map((classroom) => classroom.classroomId);

    // Gắn mặc định isMeeted = false
    myClassrooms.forEach((classroom) => {
      classroom.isMeeted = false;
    });

    if (classroomIds.length > 0) {
      const relatedMeetings = await this.meetingRepository.findMeetingsByClassroomIds(classroomIds);

      const meetingMap = new Map<string, Meeting>();
      relatedMeetings.forEach((meeting) => {
        if (meeting.classroomId) {
          meetingMap.set(meeting.classroomId, meeting);
        }
      });

      myClassrooms.forEach((classroom) => {
        if (meetingMap.has(classroom.classroomId)) {
          classroom.isMeeted = true;
        }
      });
    }

    const total = await this.classroomRepository.count({
      filter: { tutorId: tutorId, ...where }
    });

    return new PagingResponseDto(total, myClassrooms);
  }
}
