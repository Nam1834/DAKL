import { Permissions } from '@/constants/permission.constants';
import { userController } from '@/container/user.container';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { UpdateTutorProfileReq } from '@/dto/tutor/update-tutor-profile.req';
import { ForgotPasswordUserReq } from '@/dto/user/forgot-password-user.req';
import { LoginUserReq } from '@/dto/user/login-user.req';
import { RegisterUserReq } from '@/dto/user/register-user.req';
import { ResetPasswordReq } from '@/dto/user/reset-password-user.req';
import { UpdateManageUserReq } from '@/dto/user/update-manage-user.req';
import { VerifyOtpReq } from '@/dto/user/verify-otp.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const userRouter = express.Router();
userRouter
  .post('/send-otp', classValidate(RegisterUserReq), userController.sendOtp.bind(userController))
  .post('/resend-otp', userController.resendOtp.bind(userController))
  .post('/register', userController.register.bind(userController))
  .post('/logout', authenticateJWT, userController.logout.bind(userController))
  .post('/login', classValidate(LoginUserReq), userController.login.bind(userController))
  .get(
    '/search',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_ADMIN]),
    userController.searchUser.bind(userController)
  )
  .get('/auth/get-uri-microsoft', userController.getMicrosoftAuthUrl.bind(userController))
  .post('/auth/exchange-code', userController.exchangeCodeForToken.bind(userController))
  .post('/auth/callback', userController.loginMicrosoft.bind(userController))
  .get('/get-profile', authenticateJWT, userController.getProfile.bind(userController))
  .put('/update-profile', authenticateJWT, userController.updateProfile.bind(userController))
  .post('/forgot-password', classValidate(ForgotPasswordUserReq), userController.forgotPassword.bind(userController))
  .post('/verify-otp', classValidate(VerifyOtpReq), userController.verifyOtp.bind(userController))
  .post('/reset-password', classValidate(ResetPasswordReq), userController.resetPassword.bind(userController))
  .post(
    '/regis-to-tutor',
    authenticateJWT,
    classValidate(RegisToTutorReq),
    userController.regisUserToTutor.bind(userController)
  )
  .put(
    '/update-tutor-profile',
    authenticateJWT,
    classValidate(UpdateTutorProfileReq),
    userController.updateTutorProfile.bind(userController)
  )
  .get(
    '/get-list/:status',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_YEU_CAU]),
    userController.getListRequest.bind(userController)
  )
  .post(
    '/solve-request/:userId',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_YEU_CAU]),
    userController.solveRequest.bind(userController)
  )
  .put(
    '/update-user-by-id/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_NGUOI_HOC]),
    classValidate(UpdateManageUserReq),
    userController.updateUserById.bind(userController)
  )
  .delete(
    '/delete-user-by-id/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_ADMIN]),
    userController.deleteById.bind(userController)
  )
  .get('/get-list-tutor-public', authenticateJWT, userController.getListTutorPublic.bind(userController));

export default userRouter;
