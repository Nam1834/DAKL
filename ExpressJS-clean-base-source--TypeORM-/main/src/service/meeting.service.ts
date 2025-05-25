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
import * as jwt from 'jsonwebtoken';
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_REDIRECT_URI = process.env.ZOOM_REDIRECT_URI;

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
    meeting.zoomMeetingId = meetingData.id?.toString();
    meeting.topic = meetingData.topic;
    meeting.startTime = new Date(meetingData.start_time);
    meeting.joinUrl = meetingData.join_url;
    meeting.password = meetingData.password;
    meeting.classroomId = data.classroomId;

    await this.meetingRepository.save(meeting);

    return convertToDto(CreateMeetingRes, meeting);
  }
  async generateZoomSignature(meetingNumber: string, role: number): Promise<string> {
    const sdkKey = process.env.ZOOM_CLIENT_ID;
    const sdkSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!sdkKey || !sdkSecret) {
      throw new Error('Missing ZOOM_CLIENT_ID or ZOOM_CLIENT_SECRET environment variable');
    }

    const iat = Math.floor((Date.now() - 30000) / 1000);
    const exp = iat + 60 * 60;

    const payload = {
      sdkKey,
      mn: meetingNumber,
      role,
      iat,
      exp,
      appKey: sdkKey,
      tokenExp: exp
    };

    return jwt.sign(payload, sdkSecret, { algorithm: 'HS256' });
  }

  async getMeetingByClassroom(classroomId: string): Promise<CreateMeetingRes | null> {
    const meeting = await this.meetingRepository.findMany({
      filter: { classroomId },
      order: [
        {
          column: 'createdAt',
          direction: 'DESC'
        }
      ] // nếu có nhiều meeting
    });

    if (!meeting) return null;

    return convertToDto(CreateMeetingRes, meeting[0]);
  }
}
