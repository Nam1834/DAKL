import { userController } from '@/container/user.container';
import { ForgotPasswordUserReq } from '@/dto/user/forgot-password-user.req';
import { LoginUserReq } from '@/dto/user/login-user.req';
import { RegisterUserReq } from '@/dto/user/register-user.req';
import { ResetPasswordReq } from '@/dto/user/reset-password-user.req';
import { VerifyOtpReq } from '@/dto/user/verify-otp.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const authRouter = express.Router();
authRouter.get('/callback', userController.handleMicrosoftCallback.bind(userController));

export default authRouter;
