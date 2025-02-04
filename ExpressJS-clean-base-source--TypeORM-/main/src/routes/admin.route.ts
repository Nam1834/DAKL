import { Permissions } from '@/constants/permission.constants';
import { adminController } from '@/container/admin.container';
import { CreateAdminReq } from '@/dto/admin/create-admin.req';
import { LoginAdminReq } from '@/dto/admin/login-admin.req';
import { UpdateAdminReq } from '@/dto/admin/update-admin.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const adminRouter = express.Router();
adminRouter
  .post('/logout', authenticateJWT, adminController.logout.bind(adminController))
  .post('/create-admin', classValidate(CreateAdminReq), adminController.createAdmin.bind(adminController))
  .put(
    '/update-admin',
    authenticateJWT,
    classValidate(UpdateAdminReq),
    adminController.updateAdmin.bind(adminController)
  )
  .get(
    '/search',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_ADMIN]),
    adminController.searchAdmin.bind(adminController)
  )
  .post('/auth/callback', adminController.loginMicrosoft.bind(adminController))
  .post('/login', classValidate(LoginAdminReq), adminController.login.bind(adminController))
  .get('/get-profile', authenticateJWT, adminController.getProfile.bind(adminController))
  .get(
    '/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_ADMIN]),
    adminController.getDetail.bind(adminController)
  );

export default adminRouter;
