import { classroomController } from '@/container/classroom.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import express from 'express';
const classroomRouter = express.Router();

classroomRouter
  .get('/search-for-user', authenticateJWT, classroomController.searchForUser.bind(classroomController))

  .get('/search-for-tutor', authenticateJWT, classroomController.searchForTutor.bind(classroomController));
export default classroomRouter;
