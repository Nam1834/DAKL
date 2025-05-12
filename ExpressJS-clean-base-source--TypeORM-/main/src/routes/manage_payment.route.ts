import { managePaymentController } from '@/container/manage_payment.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { Permissions } from '@/constants/permission.constants';
import express from 'express';
const managePaymentRouter = express.Router();

managePaymentRouter.get(
  '/search',
  authenticateJWT,
  checkPermission([Permissions.QUAN_LY_THANH_TOAN_CHO_GIA_SU]),
  managePaymentController.searchManagePayment.bind(managePaymentController)
);
export default managePaymentRouter;
