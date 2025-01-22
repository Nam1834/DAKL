import { Permissions } from '@/constants/permission.constants';
import { curriculumnController } from '@/container/curriculumn.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import express from 'express';
const curriculumnRouter = express.Router();

curriculumnRouter
  .post(
    '/create-by-admin',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_GIAO_TRINH]),
    curriculumnController.createByAdmin.bind(curriculumnController)
  )
  .put(
    '/update-by-admin/:id',
    authenticateJWT,
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
  .get(
    '/get-by-id/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_GIAO_TRINH]),
    curriculumnController.getById.bind(curriculumnController)
  );

export default curriculumnRouter;
