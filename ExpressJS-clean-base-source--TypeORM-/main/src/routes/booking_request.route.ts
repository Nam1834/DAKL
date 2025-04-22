import { bookingRequestController } from '@/container/booking_request.container';
import { CreateBookingRequestReq } from '@/dto/booking-request/create-booking-request.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const bookingRequestRouter = express.Router();

bookingRequestRouter.post(
  '/create/:tutorId',
  authenticateJWT,
  classValidate(CreateBookingRequestReq),
  bookingRequestController.createBookingRequest.bind(bookingRequestController)
);
export default bookingRequestRouter;
