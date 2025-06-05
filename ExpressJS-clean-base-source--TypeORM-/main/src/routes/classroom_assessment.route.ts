import { classroomAssessmentController } from '@/container/classroom_assessment.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import express from 'express';
import { classValidate } from '@/middleware/class-validate.middleware';
import { CreateAssessmentReq } from '@/dto/assessment/create-assessment.req';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { Permissions } from '@/constants/permission.constants';
const classroomAssessmentRouter = express.Router();

classroomAssessmentRouter
  .get(
    '/search',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_DANH_GIA]),
    classroomAssessmentController.searchAssessment.bind(classroomAssessmentController)
  )
  .get(
    '/search-with-time',
    authenticateJWT,
    checkPermission([Permissions.THONG_KE_DANH_GIA_GIA_SU]),
    classroomAssessmentController.searchAssessmentWithTime.bind(classroomAssessmentController)
  )
  .post(
    '/create/:classroomId',
    authenticateJWT,
    classValidate(CreateAssessmentReq),
    classroomAssessmentController.createAssessment.bind(classroomAssessmentController)
  );

export default classroomAssessmentRouter;
