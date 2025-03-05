import { tutorLevelController } from '@/container/tutor_level.container';
import { CreateTutorLevelReq } from '@/dto/tutor-level/create-tutor-level.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import { Permissions } from '@/constants/permission.constants';
import express from 'express';
import { UpdateTutorLevelReq } from '@/dto/tutor-level/update-tutor-level.req';
const tutorLevelRouter = express.Router();

tutorLevelRouter
  .get('/search', tutorLevelController.searchTutorLevel.bind(tutorLevelController))
  .post(
    '/create',
    authenticateJWT,
    classValidate(CreateTutorLevelReq),
    checkPermission([Permissions.QUAN_LY_HANG_GIA_SU]),
    tutorLevelController.create.bind(tutorLevelController)
  )
  .put(
    '/update/:id',
    authenticateJWT,
    classValidate(UpdateTutorLevelReq),
    checkPermission([Permissions.QUAN_LY_MON_HOC]),
    tutorLevelController.updateById.bind(tutorLevelController)
  )
  .delete(
    '/delete/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_MON_HOC]),
    tutorLevelController.deleteTutorLevelById.bind(tutorLevelController)
  );

export default tutorLevelRouter;
