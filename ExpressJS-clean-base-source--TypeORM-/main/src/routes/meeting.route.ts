import { meetingController } from '@/container/meeting.container';
import express from 'express';
const meetingRouter = express.Router();

meetingRouter
  .get('/auth', meetingController.getZoomUrl.bind(meetingController))
  .get('/get-uri-microsoft-meeting', meetingController.getMicrosoftAuthUrlForMeeting.bind(meetingController))
  .get('/callback', meetingController.handleZoomCallback.bind(meetingController))
  .post('/handle', meetingController.handleZoomRedirect.bind(meetingController))
  .post('/create', meetingController.createMeeting.bind(meetingController));

export default meetingRouter;
