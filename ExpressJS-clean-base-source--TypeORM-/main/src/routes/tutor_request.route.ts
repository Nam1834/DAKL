import { Permissions } from '@/constants/permission.constants';
import { tutorRequestController } from '@/container/tutor_request.container';
import { CancelRequestReq } from '@/dto/tutor/cancel-request.req';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { UpdateTutorProfileReq } from '@/dto/tutor/update-tutor-profile.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const tutorRequestRouter = express.Router();

tutorRequestRouter
  .post(
    '/regis-to-tutor',
    authenticateJWT,
    classValidate(RegisToTutorReq),
    tutorRequestController.regisUserToTutor.bind(tutorRequestController)
  )
  .put(
    '/update-tutor-profile',
    authenticateJWT,
    classValidate(UpdateTutorProfileReq),
    tutorRequestController.updateTutorProfile.bind(tutorRequestController)
  )
  .get(
    '/search-request',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_YEU_CAU]),
    tutorRequestController.searchTutorRequest.bind(tutorRequestController)
  )
  .get(
    '/get-my-newest-request',
    authenticateJWT,
    tutorRequestController.getMyNewestRequest.bind(tutorRequestController)
  )
  .get('/get-my-list-request', authenticateJWT, tutorRequestController.getMyListRequest.bind(tutorRequestController))
  .post(
    '/solve-request/:tutorRequestId',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_YEU_CAU]),
    tutorRequestController.solveRequest.bind(tutorRequestController)
  )
  .put(
    '/cancel-request/:tutorRequestId',
    authenticateJWT,
    classValidate(CancelRequestReq),
    tutorRequestController.cancelRequest.bind(tutorRequestController)
  );

export default tutorRequestRouter;
