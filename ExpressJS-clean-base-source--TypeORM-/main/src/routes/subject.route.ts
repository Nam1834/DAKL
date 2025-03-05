import { subjectController } from '@/container/subject.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { Permissions } from '@/constants/permission.constants';
import express from 'express';
import { classValidate } from '@/middleware/class-validate.middleware';
import { CreateSubjectReq } from '@/dto/subject/create-subject.req';
import { UpdateSubjectReq } from '@/dto/subject/update-subject.req';
const subjectRouter = express.Router();

subjectRouter
  .get('/search', subjectController.searchSubject.bind(subjectController))
  .post(
    '/create',
    authenticateJWT,
    classValidate(CreateSubjectReq),
    checkPermission([Permissions.QUAN_LY_MON_HOC]),
    subjectController.create.bind(subjectController)
  )
  .put(
    '/update/:id',
    authenticateJWT,
    classValidate(UpdateSubjectReq),
    checkPermission([Permissions.QUAN_LY_MON_HOC]),
    subjectController.updateById.bind(subjectController)
  )
  .delete(
    '/delete/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_MON_HOC]),
    subjectController.deleteSubjectById.bind(subjectController)
  );

export default subjectRouter;
