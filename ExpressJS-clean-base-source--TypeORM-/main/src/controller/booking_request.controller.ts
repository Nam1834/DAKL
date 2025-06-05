import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateBookingRequestReq } from '@/dto/booking-request/create-booking-request.req';
import { SearchDataDto } from '@/dto/search-data.dto';
import { BookingRequest } from '@/models/booking_request.model';
import { IBookingRequestService } from '@/service/interface/i.booking_request.service';
import { ITYPES } from '@/types/interface.types';
import { getSearchData } from '@/utils/get-search-data.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class BookingRequestController {
  public common: IBaseCrudController<BookingRequest>;
  private bookingRequestService: IBookingRequestService<BookingRequest>;
  constructor(
    @inject('BookingRequestService') bookingRequestService: IBookingRequestService<BookingRequest>,
    @inject(ITYPES.Controller) common: IBaseCrudController<BookingRequest>
  ) {
    this.bookingRequestService = bookingRequestService;
    this.common = common;
  }

  async searchBookingRequestWithTime(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);

      searchData.periodType = req.query.periodType as any;
      searchData.periodValue = req.query.periodValue ? Number(req.query.periodValue) : undefined;

      const result = await this.bookingRequestService.searchWithTime(searchData);
      res.send_ok('Booking Request with time fetch successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async calculateTotalCoins(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }

      const { tutorId, hoursPerLesson, totalLessons } = req.body;

      if (!tutorId || !hoursPerLesson || !totalLessons) {
        throw new Error('Missing required fields');
      }

      const totalCoins = await this.bookingRequestService.calculateTotalCoins(tutorId, hoursPerLesson, totalLessons);

      res.send_ok('Calculate total coins successfully', { totalCoins });
    } catch (error) {
      next(error);
    }
  }

  async createBookingRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }
      const tutorId = req.params.tutorId;
      const data: CreateBookingRequestReq = req.body;

      const result = await this.bookingRequestService.createBooking(userId, tutorId, data);

      res.send_ok('Create booking request successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getListBookingRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tutor = req.user;
      const tutorId = tutor?.id;

      if (!tutorId) {
        throw new Error('You must login');
      }
      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.bookingRequestService.getListBookingRequest(tutorId, searchData);

      res.send_ok('Get list booking request successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async cancelBookingRequestByUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }
      const bookingRequestId = req.params.bookingRequestId;

      const click = req.body.click;

      const result = await this.bookingRequestService.cancelBookingRequestByUser(userId, bookingRequestId, click);

      res.send_ok('Cancel booking request successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async solveBookingRequestByTutor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tutor = req.user;
      const tutorId = tutor?.id;

      if (!tutorId) {
        throw new Error('You must login');
      }
      const bookingRequestId = req.params.bookingRequestId;

      const { click, noteOfTutor } = req.body;

      const result = await this.bookingRequestService.solveBookingRequestByTutor(
        tutorId,
        bookingRequestId,
        click,
        noteOfTutor
      );

      res.send_ok('Solve booking request successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async getMyBookingAcceptByTutorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }

      const tutorId = req.params.tutorId;

      const searchData: SearchDataDto = getSearchData(req);

      const result = await this.bookingRequestService.getMyBookingAcceptByTutorId(userId, tutorId, searchData);

      res.send_ok('Get My booking request accept successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async hireTutor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        throw new Error('You must login');
      }
      const userId = user.id;

      const bookingRequestId = req.params.bookingRequestId;

      if (!bookingRequestId) {
        throw new Error('Can not find bookingRequest');
      }

      const result = await this.bookingRequestService.hireTutorFromBookingRequest(userId, bookingRequestId);

      res.send_ok('Hire tutor successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
