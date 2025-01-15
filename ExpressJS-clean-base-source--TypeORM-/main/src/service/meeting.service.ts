import { CreateMeetingReq } from '@/dto/meeting/create-meeting.req';
import { CreateMeetingRes } from '@/dto/meeting/create-meeting.res';
import { ZoomTokenRes } from '@/dto/meeting/zoom-token.res';
import { ErrorCode } from '@/enums/error-code.enums';
import { Meeting } from '@/models/meeting.model';
import { IMeetingRepository } from '@/repository/interface/i.meeting.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { IMeetingService } from '@/service/interface/i.meeting.service';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import BaseError from '@/utils/error/base.error';
import { inject, injectable } from 'inversify';
import axios from 'axios';
import { Subject } from 'typeorm/persistence/Subject';
import { MicrosoftTokenRes } from '@/dto/user/microsoft-token.res';
import { ZoomMeetingRes } from '@/dto/meeting/zoom-meeting.res';
import { ZoomTokenRefreshRes } from '@/dto/meeting/zoom-token-refresh.res';
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI;
const MICROSOFT_CLIENT_ID: any = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET: any = process.env.MICROSOFT_CLIENT_SECRET;
const MICROSOFT_REDIRECT_URI: any = process.env.MICROSOFT_REDIRECT_URI;
const MICROSOFT_CLIENT_SCOPE: any = process.env.MICROSOFT_CLIENT_SCOPE;

@injectable()
export class MeetingService extends BaseCrudService<Meeting> implements IMeetingService<Meeting> {
  private meetingRepository: IMeetingRepository<Meeting>;

  constructor(@inject('MeetingRepository') meetingRepository: IMeetingRepository<Meeting>) {
    super(meetingRepository);
    this.meetingRepository = meetingRepository;
  }

  async getZoomAuth(): Promise<{ zoomAuthUrl: string }> {
    const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${ZOOM_CLIENT_ID}&redirect_uri=${ZOOM_REDIRECT_URI}`;

    return { zoomAuthUrl };
  }

  async getMicrosoftAuthUrlForMeeting(): Promise<{ authUrl: string }> {
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID,
      response_type: 'code',
      redirect_uri: MICROSOFT_REDIRECT_URI,
      response_mode: 'query',
      scope: 'https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/OnlineMeetings.ReadWrite'
    }).toString()}`;

    return { authUrl };
  }

  async getZoomAccessToken(
    authorizationCode: string
  ): Promise<{ userId: string; accessToken: string; refreshToken: string }> {
    const tokenUrl = 'https://zoom.us/oauth/token';
    const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

    const response = await axios.post<ZoomTokenRes>(
      tokenUrl,
      {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: ZOOM_REDIRECT_URI
      },

      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const data = response.data;

    if (!data.access_token || !data.refresh_token) {
      throw new BaseError(ErrorCode.AUTH_01, 'Failed to retrieve access token or refresh token from Zoom API');
    }

    const userResponse = await axios.get('https://api.zoom.us/v2/users/me', {
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    });

    const userData = userResponse.data as ZoomTokenRes;

    if (!userData.id) {
      throw new BaseError(ErrorCode.AUTH_01, 'Failed to retrieve userId from Zoom API');
    }

    return {
      userId: userData.id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  }

  async refreshZoomAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenUrl = 'https://zoom.us/oauth/token';
    const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

    // Gửi yêu cầu làm mới token
    const response = await axios.post<ZoomTokenRefreshRes>(
      tokenUrl,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const data = response.data;

    // Kiểm tra nếu không có access_token hoặc refresh_token
    if (!data.access_token || !data.refresh_token) {
      throw new BaseError(ErrorCode.AUTH_01, 'Failed to refresh access token from Zoom API');
    }

    // Trả về accessToken và refreshToken mới
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  }

  async createMeeting(accessToken: string, data: CreateMeetingReq): Promise<CreateMeetingRes> {
    const now = new Date();
    const startDateTime = new Date(now.getTime() + 5 * 60 * 1000);

    const meetingExist = await this.meetingRepository.exists({
      filter: { topic: data.topic, startTime: startDateTime }
    });
    if (meetingExist) {
      throw new BaseError(ErrorCode.ALREADY_EXISTS, 'Meeting already exists with the same topic and start time');
    }

    const response = await axios.post<ZoomMeetingRes>(
      `https://api.zoom.us/v2/users/me/meetings`,
      {
        topic: data.topic,
        type: 2,
        start_time: startDateTime,
        password: data.password
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const meetingData = response.data;

    const meeting = new Meeting();
    meeting.zoomMeetingId = meetingData.zoomMeetingId;
    meeting.topic = meetingData.topic;
    meeting.startTime = new Date(meetingData.start_time);
    meeting.joinUrl = meetingData.join_url;
    meeting.password = meetingData.password;

    await this.meetingRepository.save(meeting);

    return convertToDto(CreateMeetingRes, meeting);
  }

  // async createMeeting(code: string, dataREQ: CreateMeetingReq): Promise<CreateMeetingRes> {
  //   if (!code || typeof code !== 'string' || !code.trim()) {
  //     throw new Error('Invalid or missing authorization code.');
  //   }

  //   const tokenResponse = await axios.post<MicrosoftTokenRes>(
  //     'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  //     new URLSearchParams({
  //       client_id: MICROSOFT_CLIENT_ID,
  //       client_secret: MICROSOFT_CLIENT_SECRET,
  //       code: code,
  //       grant_type: 'authorization_code',
  //       redirect_uri: MICROSOFT_REDIRECT_URI
  //     }).toString(),
  //     { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  //   );

  //   if (!tokenResponse.data || !tokenResponse.data.access_token) {
  //     throw new Error('Failed to retrieve access token from Microsoft');
  //   }

  //   const accessToken = tokenResponse.data.access_token;

  //   // Bug
  //   const now = new Date();
  //   const startDateTime = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
  //   const endDateTime = new Date(now.getTime() + 65 * 60 * 1000).toISOString();
  //   const response = await axios.post<MicrosoftMeetingRes>(
  //     'https://graph.microsoft.com/v1.0/me/onlineMeetings',
  //     {
  //       startDateTime: startDateTime,
  //       endDateTime: endDateTime,
  //       subject: 'Test Meeting'
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //   );

  //   if (!response.data) {
  //     throw new Error('Failed to create meeting');
  //   }

  //   const meetingData = response.data;

  //   const meeting = new Meeting();
  //   meeting.microsoftMeetingId = meetingData.microsoftMeetingId;
  //   meeting.topic = meetingData.topic;
  //   meeting.startTime = new Date(meetingData.start_time);
  //   meeting.joinUrl = meetingData.joinUrl;

  //   await this.meetingRepository.save(meeting);

  //   return convertToDto(CreateMeetingRes, meeting);
  // }
}
