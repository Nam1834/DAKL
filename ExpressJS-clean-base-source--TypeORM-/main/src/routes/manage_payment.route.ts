import { managePaymentController } from '@/container/manage_payment.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { Permissions } from '@/constants/permission.constants';
import express from 'express';
const managePaymentRouter = express.Router();

managePaymentRouter
  .get(
    '/search',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_THANH_TOAN_CHO_GIA_SU]),
    managePaymentController.searchManagePayment.bind(managePaymentController)
  )
  .get(
    '/search-for-tutor',
    authenticateJWT,
    managePaymentController.searchManagePaymentForTutor.bind(managePaymentController)
  )
  .get(
    '/search-with-time',
    authenticateJWT,
    checkPermission([Permissions.THONG_KE_DOANH_THU]),
    managePaymentController.searchManagePaymentWithTime.bind(managePaymentController)
  )
  .get(
    '/search-with-time-for-tutor-revenue',
    authenticateJWT,
    checkPermission([Permissions.THONG_KE_DOANH_THU_GIA_SU]),
    managePaymentController.searchWithTimeForTutorRevenue.bind(managePaymentController)
  );
export default managePaymentRouter;
