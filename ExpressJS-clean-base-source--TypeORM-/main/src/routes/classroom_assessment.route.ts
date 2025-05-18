import { classroomAssessmentController } from '@/container/classroom_assessment.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import express from 'express';
import { classValidate } from '@/middleware/class-validate.middleware';
import { CreateAssessmentReq } from '@/dto/assessment/create-assessment.req';
const classroomAssessmentRouter = express.Router();

classroomAssessmentRouter.post(
  '/create/:classroomId',
  authenticateJWT,
  classValidate(CreateAssessmentReq),
  classroomAssessmentController.createAssessment.bind(classroomAssessmentController)
);

export default classroomAssessmentRouter;
