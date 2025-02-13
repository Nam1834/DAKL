import { myCurriculumnController } from '@/container/my_curriculumn.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import express from 'express';
const myCurriculumnRouter = express.Router();

myCurriculumnRouter
  .get('/get-my-curriculumn', authenticateJWT, myCurriculumnController.getMyCurriculumn.bind(myCurriculumnController))
  .post(
    '/add-to-my-curriculumn',
    authenticateJWT,
    myCurriculumnController.addToMyCurriculumn.bind(myCurriculumnController)
  )
  .delete(
    '/remove-from-mycurriculumn/:curriculumnId',
    authenticateJWT,
    myCurriculumnController.removeFromMyCurriculumn.bind(myCurriculumnController)
  );

export default myCurriculumnRouter;
