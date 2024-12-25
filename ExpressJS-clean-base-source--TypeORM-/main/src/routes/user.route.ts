import { userController } from '@/container/user.container';
import { ForgotPasswordUserReq } from '@/dto/user/forgot-password-user.req';
import { LoginUserReq } from '@/dto/user/login-user.req';
import { RegisterUserReq } from '@/dto/user/register-user.req';
import { ResetPasswordReq } from '@/dto/user/reset-password-user.req';
import { VerifyOtpReq } from '@/dto/user/verify-otp.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const userRouter = express.Router();
userRouter
  .post('/register', classValidate(RegisterUserReq), userController.register.bind(userController))
  .post('/logout', authenticateJWT, userController.logout.bind(userController))
  .post('/login', classValidate(LoginUserReq), userController.login.bind(userController))
  .get('/auth/get-uri-microsoft', userController.getMicrosoftAuthUrl.bind(userController))
  .post('/auth/exchange-code', userController.exchangeCodeForToken.bind(userController))
  .post('/auth/callback', userController.loginMicrosoft.bind(userController))
  .get('/get-profile', authenticateJWT, userController.getProfile.bind(userController))
  .put('/update-profile', authenticateJWT, userController.updateProfile.bind(userController))
  .post('/forgot-password', classValidate(ForgotPasswordUserReq), userController.forgotPassword.bind(userController))
  .post('/verify-otp', classValidate(VerifyOtpReq), userController.verifyOtp.bind(userController))
  .post('/reset-password', classValidate(ResetPasswordReq), userController.resetPassword.bind(userController));

export default userRouter;
