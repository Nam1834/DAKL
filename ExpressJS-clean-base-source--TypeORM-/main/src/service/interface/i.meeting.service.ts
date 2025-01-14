import { CreateMeetingReq } from '@/dto/meeting/create-meeting.req';
import { CreateMeetingRes } from '@/dto/meeting/create-meeting.res';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMeetingService<T extends BaseModelType> extends IBaseCrudService<T> {
  getZoomAuth(): Promise<{ zoomAuthUrl: string }>;
  getMicrosoftAuthUrlForMeeting(): Promise<{ authUrl: string }>;
  getZoomAccessToken(authorizationCode: string): Promise<string>;
  createMeeting(accessToken: string, data: CreateMeetingReq): Promise<CreateMeetingRes>;
}
