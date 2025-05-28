import express from 'express';
import bodyParser from 'body-parser';
import { meetingController } from '@/container/meeting.container';

const webhookRoute = express.Router();

webhookRoute.post(
  '/listen-webhook',
  bodyParser.raw({ type: 'application/json' }),
  meetingController.handleWebhook.bind(meetingController)
);

export default webhookRoute;
