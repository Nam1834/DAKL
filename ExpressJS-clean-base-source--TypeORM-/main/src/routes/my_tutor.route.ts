import { myTutorController } from '@/container/my_tutor.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import express from 'express';
const myTutorRouter = express.Router();

myTutorRouter
  .delete('/remove/:tutorId', authenticateJWT, myTutorController.removeFromMytutor.bind(myTutorController))

  .post('/add', authenticateJWT, myTutorController.addToMyTutor.bind(myTutorController))

  .get('/me', authenticateJWT, myTutorController.getMyTutor.bind(myTutorController));

export default myTutorRouter;
