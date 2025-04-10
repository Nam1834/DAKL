import { Permissions } from '@/constants/permission.constants';
import { curriculumnController } from '@/container/curriculumn.container';
import { CreateCurriculumnReq } from '@/dto/curriculumn/create-curriculumn.req';
import { UpdateCurriculumnReq } from '@/dto/curriculumn/update-curriculumn.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const curriculumnRouter = express.Router();

curriculumnRouter
  .post(
    '/create-by-admin',
    authenticateJWT,
    classValidate(CreateCurriculumnReq),
    checkPermission([Permissions.QUAN_LY_GIAO_TRINH]),
    curriculumnController.createByAdmin.bind(curriculumnController)
  )
  .put(
    '/update-by-admin/:id',
    authenticateJWT,
    classValidate(UpdateCurriculumnReq),
    checkPermission([Permissions.QUAN_LY_GIAO_TRINH]),
    curriculumnController.updateByAdminById.bind(curriculumnController)
  )
  .delete(
    '/delete-by-admin/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_GIAO_TRINH]),
    curriculumnController.deleteCurriculumnById.bind(curriculumnController)
  )
  .get(
    '/get-list',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_GIAO_TRINH]),
    curriculumnController.getListCurriculumn.bind(curriculumnController)
  )
  .get('/search', curriculumnController.searchCurriculumn.bind(curriculumnController))
  .get(
    '/get-by-id/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_GIAO_TRINH]),
    curriculumnController.getById.bind(curriculumnController)
  );

export default curriculumnRouter;
