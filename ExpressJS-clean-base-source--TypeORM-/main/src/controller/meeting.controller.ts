import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateMeetingReq } from '@/dto/meeting/create-meeting.req';
import { SearchDataDto } from '@/dto/search-data.dto';
import { ErrorCode } from '@/enums/error-code.enums';
import { Meeting } from '@/models/meeting.model';
import { IMeetingService } from '@/service/interface/i.meeting.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { getSearchData } from '@/utils/get-search-data.util';
import { verifyZoomSignature } from '@/utils/zoom/verify-zoom-signature.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { error } from 'node:console';

@injectable()
export class MeetingController {
  public common: IBaseCrudController<Meeting>;
  private meetingService: IMeetingService<Meeting>;
  constructor(
    @inject('MeetingService') meetingService: IMeetingService<Meeting>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Meeting>
  ) {
    this.meetingService = meetingService;
    this.common = common;
  }

  async searchMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.meetingService.search(searchData);
      res.send_ok('Meeting fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const isValid = verifyZoomSignature(req);

      if (!isValid) {
        console.warn('Invalid Zoom webhook signature');
        return res.status(401).json({ message: 'Unauthorized webhook' });
      }

      const { event, payload } = req.body;
      const object = payload.object;

      console.log('Zoom Event:', event);
      console.log('Payload:', payload);

      // if (event === 'meeting.ended') {
      //   await this.meetingService.handleMeetingEnded(payload.object);
      // }
      switch (event) {
        case 'meeting.ended':
          await this.meetingService.handleMeetingEnded(object);
          break;
        case 'meeting.participant_admitted':
          await this.meetingService.handleParticipantAdmitted(object);
          break;
        case 'meeting.participant_left':
          await this.meetingService.handleParticipantLeft(object);
          break;
      }

      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }

  async getZoomUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.meetingService.getZoomAuth();
      res.send_ok('Microsoft Auth URL generated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async handleZoomCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.query;

      if (!code) {
        throw new Error('Authorization code not found.');
      }
      res.send_ok('Authorization code successful', code);
    } catch (error) {
      next(error);
    }
  }

  async handleZoomRedirect(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authorizationCode =
        typeof req.body.authorizationCode === 'string' ? req.body.authorizationCode.trim() : undefined;

      if (!authorizationCode) {
        res.status(400).send({ error: 'Invalid or missing authorization code.' });
        return;
      }

      const result = await this.meetingService.getZoomAccessToken(authorizationCode);

      res.send_ok('Access token retrieved successfully', { result });
    } catch (error) {
      next(error);
    }
  }

  async refreshZoomAccessToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = typeof req.body.refreshToken === 'string' ? req.body.refreshToken.trim() : undefined;

      if (!refreshToken) {
        res.status(400).send({ error: 'Invalid or missing refresh token.' });
        return;
      }
      const result = await this.meetingService.refreshZoomAccessToken(refreshToken);

      res.send_ok('Refresh access token successfully', { result });
    } catch (error) {
      next(error);
    }
  }

  async createMeeting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1];

      if (!accessToken) {
        throw new BaseError(ErrorCode.AUTH_01, 'Missing or invalid authorization token.');
      }
      const data: CreateMeetingReq = req.body;
      const result = await this.meetingService.createMeeting(accessToken, data);
      res.send_ok('Zoom Meeting created successfully', result);
    } catch (error) {
      next(error);
    }
  }
  async generateZoomSignature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { zoomMeetingId, role } = req.body;
      if (!zoomMeetingId) {
        res.status(400).send({ error: 'Missing meetingId' });
        return;
      }

      const meeting = await this.meetingService.findOne({
        filter: { zoomMeetingId: zoomMeetingId }
      });

      if (!meeting?.zoomMeetingId) {
        res.status(404).send({ error: 'Meeting not found or missing Zoom Meeting ID' });
        return;
      }

      const signature = await this.meetingService.generateZoomSignature(zoomMeetingId, role || 0);

      res.send_ok('Zoom SDK signature generated successfully', {
        sdkKey: process.env.ZOOM_CLIENT_ID,
        signature,
        meetingNumber: meeting.zoomMeetingId,
        password: meeting.password
      });
    } catch (error) {
      next(error);
    }
  }

  async getMeetingByClassroom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { classroomId } = req.body;
      if (!classroomId) {
        res.status(400).send({ error: 'Missing classroomId' });
        return;
      }

      // const meeting = await this.meetingService.findOne({
      //   filter: { classroomId: classroomId }
      // });

      // if (!meeting?.classroomId) {
      //   res.status(404).send({ error: 'Meeting not found ' });
      //   return;
      // }

      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.meetingService.getMeetingByClassroom(classroomId, searchData);

      res.send_ok('Get meeting successfully', {
        result
      });
    } catch (error) {
      next(error);
    }
  }
}
