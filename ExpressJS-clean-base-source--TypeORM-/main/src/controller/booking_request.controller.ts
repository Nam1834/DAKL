import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateBookingRequestReq } from '@/dto/booking-request/create-booking-request.req';
import { BookingRequest } from '@/models/booking_request.model';
import { IBookingRequestService } from '@/service/interface/i.booking_request.service';
import { ITYPES } from '@/types/interface.types';
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
}
