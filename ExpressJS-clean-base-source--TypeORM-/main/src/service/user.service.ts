import { User } from '@/models/user.model';
import { UserProfile } from '@/models/user_profile.model';
import { IUserRepository } from '@/repository/interface/i.user.repository';
import { IUserProfileRepository } from '@/repository/interface/i.user_profile.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { inject, injectable } from 'inversify';
import { IUserService } from './interface/i.user.service';
import bcrypt from 'bcrypt';
import { RegisterUserReq } from '@/dto/user/register-user.req';
import { RegisterUserRes } from '@/dto/user/register-user.res';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import { LoginUserReq } from '@/dto/user/login-user.req';
import { LoginUserRes } from '@/dto/user/login-user.res';
import BaseError from '@/utils/error/base.error';
import { ErrorCode } from '@/enums/error-code.enums';
import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { GetProfileRes } from '@/dto/user/get-profile-user.res';
import { createEmailContent } from '@/utils/email/create-email-content.util';
import { sendEmail } from '@/utils/email/email-sender.util';
import { UpdateProfileUserReq } from '@/dto/user/update-profile-user.req';
import { UpdateProfileUserRes } from '@/dto/user/update-profile-user.res';
import redis from '@/utils/redis/redis.util';
import { createEmailOtpContent } from '@/utils/email/create-email-otp-content.util';
import { ForgotPasswordUserReq } from '@/dto/user/forgot-password-user.req';
import { VerifyOtpRes } from '@/dto/user/verify-otp.res';
import { VerifyOtpReq } from '@/dto/user/verify-otp.req';
import { ResetPasswordReq } from '@/dto/user/reset-password-user.req';
import { ResetPasswordRes } from '@/dto/user/reset-password-user.res';
const SECRET_KEY: any = process.env.SECRET_KEY;

@injectable()
export class UserService extends BaseCrudService<User> implements IUserService<User> {
  private userRepository: IUserRepository<User>;
  private userProfileRepository: IUserProfileRepository<UserProfile>;

  constructor(
    @inject('UserRepository') userRepository: IUserRepository<User>,
    @inject('UserProfileRepository') userProfileRepository: IUserProfileRepository<UserProfile>
  ) {
    super(userRepository);
    this.userRepository = userRepository;
    this.userProfileRepository = userProfileRepository;
  }

  async register(data: RegisterUserReq): Promise<RegisterUserRes> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const userProfile = new UserProfile();
    userProfile.personalEmail = data.email;
    userProfile.fullname = data.fullname;
    userProfile.birthday = new Date(data.birthday);
    userProfile.homeAddress = data.homeAddress;
    userProfile.personalEmail = data.email;
    userProfile.phoneNumber = data.phoneNumber;
    userProfile.gender = data.gender;

    (data as unknown as User).userProfile = userProfile;

    const user = await this.userRepository.create({
      data: data
    });

    const result = await this.userRepository.findOne({
      filter: { userId: user.userId },
      relations: ['userProfile']
    });

    if (!result) {
      throw new Error('Failed to find the registered user');
    }

    const emailContent = createEmailContent(data.fullname);

    sendEmail({
      from: { name: 'Công ty Alpha' },
      to: { emailAddress: [result.email] },
      subject: 'Chúc mừng đăng ký tài khoản thành công',
      text: emailContent
    });

    return convertToDto(RegisterUserRes, result);
  }

  async login(data: LoginUserReq): Promise<LoginUserRes> {
    let user: User | null = null;

    if (/^\d{10,11}$/.test(data.emailOrPhoneNumber)) {
      user = await this.userRepository.findOne({
        filter: { phoneNumber: data.emailOrPhoneNumber }
      });
    } else {
      user = await this.userRepository.findOne({
        filter: { email: data.emailOrPhoneNumber }
      });
    }

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user!.password);

    if (!isPasswordValid) {
      throw new BaseError(ErrorCode.AUTH_01, 'Password is incorrect');
    }

    // Luu vao JWt
    const claim = new JwtClaimDto(user.userId, '', [], '');

    const token = jwt.sign(_.toPlainObject(claim), SECRET_KEY, {
      expiresIn: 3 * 60 * 60
    });

    const result = convertToDto(LoginUserRes, user);
    result.token = token;

    return result;
  }

  async getProfile(userId: string): Promise<GetProfileRes> {
    const user = await this.userRepository.findOne({
      filter: { userId },
      relations: ['userProfile']
    });

    if (!user || !user.userProfile) {
      throw new Error('User profile not found');
    }

    return user.userProfile;
  }

  async updateProfile(userId: string, data: UpdateProfileUserReq): Promise<UpdateProfileUserRes> {
    const updatedUser = await this.userRepository.findOne({
      filter: { userId },
      relations: ['userProfile']
    });

    if (!updatedUser || !updatedUser.userProfile) {
      throw new Error('User profile not found');
    }

    const userProfileUpdatePayload: Partial<UserProfile> = {
      fullname: data.fullname,
      avatar: data.avatar,
      workEmail: data.workEmail,
      homeAddress: data.homeAddress,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      gender: data.gender
    };

    Object.keys(userProfileUpdatePayload).forEach(
      (key) =>
        userProfileUpdatePayload[key as keyof UserProfile] === undefined &&
        delete userProfileUpdatePayload[key as keyof UserProfile]
    );

    await this.userProfileRepository.findOneAndUpdate({
      filter: { userId },
      updateData: userProfileUpdatePayload
    });

    const updatedProfile = {
      ...updatedUser.userProfile,
      ...userProfileUpdatePayload
    };

    return updatedProfile;
  }

  async forgotPassword(data: ForgotPasswordUserReq): Promise<void> {
    let user: User | null = null;

    if (/^\d{10,11}$/.test(data.emailOrPhoneNumber)) {
      user = await this.userRepository.findOne({ filter: { phoneNumber: data.emailOrPhoneNumber } });
    } else {
      user = await this.userRepository.findOne({ filter: { email: data.emailOrPhoneNumber } });
    }

    if (!user) {
      throw new Error('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${user.email}`, otp, 'EX', 300);

    const emailContent = createEmailOtpContent(otp);
    sendEmail({
      from: { name: 'Công ty Alpha' },
      to: { emailAddress: [user.email] },
      subject: 'OTP for Password Reset',
      text: emailContent
    });
  }

  async verifyOtp(data: VerifyOtpReq): Promise<VerifyOtpRes> {
    const otp = await redis.get(`otp:${data.email}`);
    if (!otp || otp !== data.otp) {
      throw new Error('Invalid OTP');
    }
    return { message: 'OTP verified successfully' };
  }

  async resetPassword(data: ResetPasswordReq): Promise<ResetPasswordRes> {
    const otp = await redis.get(`otp:${data.email}`);
    if (!otp || otp !== data.otp) {
      throw new Error('Invalid OTP');
    }

    await redis.del(`otp:${data.email}`);

    const { newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const user = await this.userRepository.findOne({ filter: { email: data.email } });
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.userRepository.findOneAndUpdate({
      filter: { userId: user.userId },
      updateData: user
    });

    const response = convertToDto(ResetPasswordRes, user);
    return response;
  }
}
