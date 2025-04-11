import { tutorRequestController } from '@/container/tutor_request.container';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const tutorRequestRouter = express.Router();

tutorRequestRouter.post(
  '/regis-to-tutor',
  authenticateJWT,
  classValidate(RegisToTutorReq),
  tutorRequestController.regisUserToTutor.bind(tutorRequestController)
);

export default tutorRequestRouter;
