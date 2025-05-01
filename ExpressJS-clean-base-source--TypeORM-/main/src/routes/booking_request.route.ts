import { bookingRequestController } from '@/container/booking_request.container';
import { CreateBookingRequestReq } from '@/dto/booking-request/create-booking-request.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const bookingRequestRouter = express.Router();

bookingRequestRouter
  .post(
    '/create/:tutorId',
    authenticateJWT,
    classValidate(CreateBookingRequestReq),
    bookingRequestController.createBookingRequest.bind(bookingRequestController)
  )
  .patch(
    '/cancel-booking/:bookingRequestId',
    authenticateJWT,
    bookingRequestController.cancelBookingRequestByUserController.bind(bookingRequestController)
  )
  .get(
    '/get-list-booking',
    authenticateJWT,
    bookingRequestController.getListBookingRequest.bind(bookingRequestController)
  )
  .get(
    '/get-my-booking-request-accept/:tutorId',
    authenticateJWT,
    bookingRequestController.getMyBookingAcceptByTutorId.bind(bookingRequestController)
  )
  .patch(
    '/solve-booking/:bookingRequestId',
    authenticateJWT,
    bookingRequestController.solveBookingRequestByTutor.bind(bookingRequestController)
  );

export default bookingRequestRouter;
