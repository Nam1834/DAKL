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
}
