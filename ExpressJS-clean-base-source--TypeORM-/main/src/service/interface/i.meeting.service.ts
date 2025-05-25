import { CreateMeetingReq } from '@/dto/meeting/create-meeting.req';
import { CreateMeetingRes } from '@/dto/meeting/create-meeting.res';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMeetingService<T extends BaseModelType> extends IBaseCrudService<T> {
  getZoomAuth(): Promise<{ zoomAuthUrl: string }>;
  getZoomAccessToken(authorizationCode: string): Promise<{ userId: string; accessToken: string; refreshToken: string }>;
  refreshZoomAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  createMeeting(accessToken: string, data: CreateMeetingReq): Promise<CreateMeetingRes>;
  generateZoomSignature(meetingNumber: string, role: number): Promise<string>;
  getMeetingByClassroom(classroomId: string): Promise<CreateMeetingRes | null>;
}
