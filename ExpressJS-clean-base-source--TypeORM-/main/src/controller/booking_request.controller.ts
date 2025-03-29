import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
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
}
