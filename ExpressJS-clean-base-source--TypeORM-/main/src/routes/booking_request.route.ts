import { bookingRequestController } from '@/container/booking_request.container';
import { CreateBookingRequestReq } from '@/dto/booking-request/create-booking-request.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import { Permissions } from '@/constants/permission.constants';
import express from 'express';
const bookingRequestRouter = express.Router();

bookingRequestRouter
  .get(
    '/search-with-time',
    authenticateJWT,
    checkPermission([Permissions.THONG_KE_LUOT_THUE]),
    bookingRequestController.searchBookingRequestWithTime.bind(bookingRequestController)
  )
  .get(
    '/search-with-time-for-tutor',
    authenticateJWT,
    bookingRequestController.searchBookingRequestWithTimeForTutor.bind(bookingRequestController)
  )
  .post(
    '/calculate-coins',
    authenticateJWT,
    bookingRequestController.calculateTotalCoins.bind(bookingRequestController)
  )
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
  )
  .put(
    '/hire-tutor/:bookingRequestId',
    authenticateJWT,
    bookingRequestController.hireTutor.bind(bookingRequestController)
  );

export default bookingRequestRouter;
