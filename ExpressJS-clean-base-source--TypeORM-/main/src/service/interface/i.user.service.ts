import { BaseModelType } from '@/types/base-model.types';
import { IBaseCrudService } from './i.base.service';
import { RegisterUserReq } from '@/dto/user/register-user.req';
import { RegisterUserRes } from '@/dto/user/register-user.res';
import { LoginUserReq } from '@/dto/user/login-user.req';
import { LoginUserRes } from '@/dto/user/login-user.res';
import { GetProfileRes } from '@/dto/user/get-profile-user.res';
import { UpdateProfileUserReq } from '@/dto/user/update-profile-user.req';
import { UpdateProfileUserRes } from '@/dto/user/update-profile-user.res';
import { ForgotPasswordUserReq } from '@/dto/user/forgot-password-user.req';
import { VerifyOtpReq } from '@/dto/user/verify-otp.req';
import { VerifyOtpRes } from '@/dto/user/verify-otp.res';
import { ResetPasswordReq } from '@/dto/user/reset-password-user.req';
import { ResetPasswordRes } from '@/dto/user/reset-password-user.res';

export interface IUserService<T extends BaseModelType> extends IBaseCrudService<T> {
  register(data: RegisterUserReq): Promise<RegisterUserRes>;
  login(data: LoginUserReq): Promise<LoginUserRes>;
  getProfile(userId: string): Promise<GetProfileRes>;
  updateProfile(userId: string, data: UpdateProfileUserReq): Promise<UpdateProfileUserRes>;
  forgotPassword(data: ForgotPasswordUserReq): Promise<void>;
  verifyOtp(data: VerifyOtpReq): Promise<VerifyOtpRes>;
  resetPassword(data: ResetPasswordReq): Promise<ResetPasswordRes>;
}
