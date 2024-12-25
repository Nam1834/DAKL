import { adminController } from '@/container/admin.container';
import { CreateAdminReq } from '@/dto/admin/create-admin.req';
import { LoginAdminReq } from '@/dto/admin/login-admin.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const adminRouter = express.Router();
adminRouter
  .post('/logout', authenticateJWT, adminController.logout.bind(adminController))
  .post('/create-admin', classValidate(CreateAdminReq), adminController.createAdmin.bind(adminController))
  .post('/login', classValidate(LoginAdminReq), adminController.login.bind(adminController))
  .get('/get-profile', authenticateJWT, adminController.getProfile.bind(adminController));

export default adminRouter;
