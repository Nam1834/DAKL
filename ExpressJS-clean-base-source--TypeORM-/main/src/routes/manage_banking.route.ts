import { manageBankingController } from '@/container/manage_banking.container';
import { CreateManageBankingReq } from '@/dto/manage-banking/create-manage-banking.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const manageBankingRouter = express.Router();

manageBankingRouter
  .get('/search', authenticateJWT, manageBankingController.searchManageBanking.bind(manageBankingController))
  .get('/get-my', authenticateJWT, manageBankingController.getMyManageBanking.bind(manageBankingController))
  .post(
    '/create',
    authenticateJWT,
    classValidate(CreateManageBankingReq),
    manageBankingController.createManageBanking.bind(manageBankingController)
  )
  .patch(
    '/solve-manage-banking',
    authenticateJWT,
    manageBankingController.solveManageBanking.bind(manageBankingController)
  )
  .put(
    '/cancel-manage-banking',
    authenticateJWT,
    manageBankingController.cancelManageBankingByTutor.bind(manageBankingController)
  );

export default manageBankingRouter;
