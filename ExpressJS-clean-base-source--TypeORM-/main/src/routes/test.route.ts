import express from 'express';
import { testController } from '@/container/test.container';
const testRouter = express.Router();

testRouter.get('/search', testController.searchTest.bind(testController));

export default testRouter;
