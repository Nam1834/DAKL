import { Meeting } from '@/models/meeting.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IMeetingRepository<T> extends IBaseRepository<T> {
  findMeetingsByClassroomIds(classroomIds: string[]): Promise<Meeting[]>;
}
