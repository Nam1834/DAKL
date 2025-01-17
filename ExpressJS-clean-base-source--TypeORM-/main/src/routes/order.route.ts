import { orderController } from '@/container/order.container';
import { CreateOrderWithValueConfigIdReq } from '@/dto/order/create-order-with-value-config-id.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const orderRouter = express.Router();
orderRouter.post(
  '/create-order/with-value-config-id',
  authenticateJWT,
  classValidate(CreateOrderWithValueConfigIdReq),
  orderController.createOrderWithValueConfigId.bind(orderController)
);
export default orderRouter;
