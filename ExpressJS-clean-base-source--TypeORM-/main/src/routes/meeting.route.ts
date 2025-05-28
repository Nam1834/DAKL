import { meetingController } from '@/container/meeting.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import express from 'express';
const meetingRouter = express.Router();

meetingRouter
  .post('/listen-webhook', meetingController.handleWebhook.bind(meetingController))
  .get('/get-meeting', authenticateJWT, meetingController.getMeetingByClassroom.bind(meetingController))
  .get('/auth', meetingController.getZoomUrl.bind(meetingController))
  .get('/callback', meetingController.handleZoomCallback.bind(meetingController))
  .post('/handle', meetingController.handleZoomRedirect.bind(meetingController))
  .post('/zoom/refresh', meetingController.refreshZoomAccessToken.bind(meetingController))
  .post('/create', meetingController.createMeeting.bind(meetingController))
  .post('/signature', meetingController.generateZoomSignature.bind(meetingController));

export default meetingRouter;
