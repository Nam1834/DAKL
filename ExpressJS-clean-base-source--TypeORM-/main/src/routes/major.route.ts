import { Permissions } from '@/constants/permission.constants';
import { majorController } from '@/container/major.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import express from 'express';
const majorRouter = express.Router();

majorRouter
  .get('/search', majorController.searchMajor.bind(majorController))
  // .get('/search-all', majorController.searchAllMajor.bind(majorController))
  .post(
    '/create',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_NGANH]),
    majorController.create.bind(majorController)
  )
  .put(
    '/update/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_NGANH]),
    majorController.updateById.bind(majorController)
  )
  .delete(
    '/delete/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_NGANH]),
    majorController.deleteMajorById.bind(majorController)
  )
  .get(
    '/',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_NGANH]),
    majorController.getListMajor.bind(majorController)
  );

export default majorRouter;
