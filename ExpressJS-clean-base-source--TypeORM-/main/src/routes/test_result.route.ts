import { testResultController } from '@/container/test_result.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import express from 'express';
const testResultRouter = express.Router();

testResultRouter.post('/submit-test', authenticateJWT, testResultController.submitTest.bind(testResultController));

export default testResultRouter;
