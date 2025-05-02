import { paymentController } from '@/container/payment.container';
import { Permissions } from '@/constants/permission.constants';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import express from 'express';
const paymentRouter = express.Router();
paymentRouter
  .get(
    '/search',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_VI_NGUOI_DUNG]),
    paymentController.searchPayment.bind(paymentController)
  )
  .get('/get-my-payment', authenticateJWT, paymentController.getMyPayment.bind(paymentController))
  .get('/vnp-return', paymentController.vnpReturn.bind(paymentController))

  .get('/vnp-url/:paymentId', paymentController.getVnpUrl.bind(paymentController));

export default paymentRouter;
