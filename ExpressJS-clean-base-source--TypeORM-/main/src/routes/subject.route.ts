import { subjectController } from '@/container/subject.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { Permissions } from '@/constants/permission.constants';
import express from 'express';
import { classValidate } from '@/middleware/class-validate.middleware';
import { CreateSubjectReq } from '@/dto/subject/create-subject.req';
const subjectRouter = express.Router();

subjectRouter.post(
  '/create',
  authenticateJWT,
  classValidate(CreateSubjectReq),
  checkPermission([Permissions.QUAN_LY_MON_HOC]),
  subjectController.create.bind(subjectController)
);

export default subjectRouter;
