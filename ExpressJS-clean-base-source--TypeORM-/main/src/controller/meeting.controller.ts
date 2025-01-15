import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateMeetingReq } from '@/dto/meeting/create-meeting.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { Meeting } from '@/models/meeting.model';
import { IMeetingService } from '@/service/interface/i.meeting.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

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

  async getZoomUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.meetingService.getZoomAuth();
      res.send_ok('Microsoft Auth URL generated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getMicrosoftAuthUrlForMeeting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.meetingService.getMicrosoftAuthUrlForMeeting();
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

      const accessToken = await this.meetingService.getZoomAccessToken(authorizationCode);

      res.send_ok('Access token retrieved successfully', { accessToken });
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
}
