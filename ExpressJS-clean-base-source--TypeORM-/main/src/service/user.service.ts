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
import _, { filter } from 'lodash';
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
import axios from 'axios';
import { MicrosoftTokenRes } from '@/dto/user/microsoft-token.res';
import moment from 'moment';
import { error, log } from 'console';
import { RedisSchemaEnum } from '@/enums/redis-schema.enum';
import { ITutorProfileRepository } from '@/repository/interface/i.tutor_profile.repository';
import { TutorProfile } from '@/models/tutor_profile.model';
import { UserStatus } from '@/enums/user-status.enum';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { PagingDto } from '@/dto/paging.dto';
import { GetListRequestRes } from '@/dto/tutor/get-list-request.res';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchUtil } from '@/utils/search.util';
import { SearchDataDto } from '@/dto/search-data.dto';
import { REFUSED } from 'dns';
import { UserTypeEnum } from '@/enums/user-type.enum';
import { Curriculumn } from '@/models/curriculumn.model';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { MyCurriculumnItem } from '@/models/my-curriculumn-item.model';
import { IMyCurriculumnRepository } from '@/repository/interface/i.my_curriculumn.repository';
import { ICurriculumnRepository } from '@/repository/interface/i.curriculumn.repository';
import { IMyCurriculumnItemRepository } from '@/repository/interface/i.my_curriculumn_item.repository';
import { CurriculumnStatus } from '@/enums/curriculumn-status.eum';
import { sendSms } from '@/utils/sms/sms-sender.util';
import { UpdateManageUserReq } from '@/dto/user/update-manage-user.req';
import { UserCheckActiveEnum } from '@/enums/user-check-active.enum';
import { TutorLevelEnum } from '@/enums/tutor_level.enum';
import { TutorSubject } from '@/models/tutor_subject.model';
import { ITutorSubjectRepository } from '@/repository/interface/i.tutor_subject.repository';
import { UpdateTutorProfileReq } from '@/dto/tutor/update-tutor-profile.req';
import { UpdateTutorProfileRes } from '@/dto/tutor/update-tutor-profile.res';
import { GetListPublicTutorProfileRes } from '@/dto/tutor/get-list-public-tutor-profile.res';
import { ITutorLevelRepository } from '@/repository/interface/i.tutor_level.repository';
import { TutorLevel } from '@/models/tutor_level.model';
import ejs from 'ejs';
import path from 'path';

const SECRET_KEY: any = process.env.SECRET_KEY;
const MICROSOFT_CLIENT_ID: any = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET: any = process.env.MICROSOFT_CLIENT_SECRET;
const MICROSOFT_REDIRECT_USER_URI: any = process.env.MICROSOFT_REDIRECT_USER_URI;
const MICROSOFT_CLIENT_SCOPE: any = process.env.MICROSOFT_CLIENT_SCOPE;

@injectable()
export class UserService extends BaseCrudService<User> implements IUserService<User> {
  private userRepository: IUserRepository<User>;
  private userProfileRepository: IUserProfileRepository<UserProfile>;
  private tutorProfileRepository: ITutorProfileRepository<TutorProfile>;
  private myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>;
  private curriculumnRepository: ICurriculumnRepository<Curriculumn>;
  private myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>;
  private tutorSubjectRepository: ITutorSubjectRepository<TutorSubject>;
  private tutorLevelRepository: ITutorLevelRepository<TutorLevel>;

  private LOGIN_TOKEN_EXPIRE = 3 * 60 * 60;

  constructor(
    @inject('UserRepository') userRepository: IUserRepository<User>,
    @inject('UserProfileRepository') userProfileRepository: IUserProfileRepository<UserProfile>,
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>,
    @inject('MyCurriculumnRepository') myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>,
    @inject('CurriculumnRepository') curriculumnRepository: ICurriculumnRepository<Curriculumn>,
    @inject('MyCurriculumnItemRepository') myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>,
    @inject('TutorSubjectRepository') tutorSubjectRepository: ITutorSubjectRepository<TutorSubject>,
    @inject('TutorLevelRepository') tutorLevelRepository: ITutorLevelRepository<TutorLevel>
  ) {
    super(userRepository);
    this.userRepository = userRepository;
    this.userProfileRepository = userProfileRepository;
    this.tutorProfileRepository = tutorProfileRepository;
    this.myCurriculumnRepository = myCurriculumnRepository;
    this.curriculumnRepository = curriculumnRepository;
    this.myCurriculumnItemRepository = myCurriculumnItemRepository;
    this.tutorSubjectRepository = tutorSubjectRepository;
    this.tutorLevelRepository = tutorLevelRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<User>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const users = await this.userRepository.findMany({
      filter: where,
      order: order,
      paging: paging,
      relations: ['userProfile', 'tutorProfile']
    });

    users.forEach((admin) => {
      delete (admin as any).password;
    });

    const total = await this.userRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, users);
  }

  async logout(userId: string): Promise<void> {
    /*
    Set token logout time => check token logout time when authenticate
    And if token logout time >= token iat => not allow access
    Also set expire time for this key to make sure that the token will be deleted after a period of time = token expire time
    */
    const currentTimeStamp = moment().unix();

    await redis.set(`${RedisSchemaEnum.logoutTokenTime}:${userId}`, currentTimeStamp, 'EX', this.LOGIN_TOKEN_EXPIRE);

    return;
  }

  async sendOtp(data: RegisterUserReq): Promise<void> {
    const emailExist = await this.exists({ filter: { email: data.email } });
    if (emailExist) {
      throw new Error('Email has already been registered');
    }

    const phoneNumberExist = await this.exists({ filter: { phoneNumber: data.phoneNumber } });
    if (phoneNumberExist) {
      throw new Error('Phone number already exists');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${data.email}`, otp, 'EX', 300);
    await redis.set(`REGISTER_${data.email}`, JSON.stringify(data), 'EX', 600);

    const emailTemplatePath = path.join(__dirname, '../utils/email/otp-template.util.ejs');

    const emailContent = await ejs.renderFile(emailTemplatePath, {
      fullname: data.fullname,
      email: data.email,
      otp: otp
    });

    await sendEmail({
      from: { name: 'GiaSuVLU' },
      to: { emailAddress: [data.email] },
      subject: 'Xác nhận đăng ký tài khoản',
      html: emailContent
    });
  }

  async resendOtp(email: string): Promise<void> {
    const storedData = await redis.get(`REGISTER_${email}`);
    if (!storedData) {
      throw new Error('Session expired. Please register again.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, otp, 'EX', 300);
    await redis.set(`REGISTER_${email}`, storedData, 'EX', 600);

    const data: RegisterUserReq = JSON.parse(storedData);

    const emailTemplatePath = path.join(__dirname, '../utils/email/otp-template.util.ejs');

    const emailContent = await ejs.renderFile(emailTemplatePath, {
      fullname: data.fullname,
      email: email,
      otp: otp
    });

    await sendEmail({
      from: { name: 'GiaSuVLU' },
      to: { emailAddress: [email] },
      subject: 'Xác nhận đăng ký tài khoản',
      html: emailContent
    });
  }

  async register(email: string, otp: string): Promise<RegisterUserRes> {
    const storedOtp = await redis.get(`otp:${email}`);
    const storedData = await redis.get(`REGISTER_${email}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new Error('Invalid or expired OTP');
    }

    if (!storedData) {
      throw new Error('Session expired. Please try again.');
    }

    const data: RegisterUserReq = JSON.parse(storedData);
    data.password = await bcrypt.hash(data.password, 10);

    const user = new User();
    Object.assign(user, data);

    const userProfile = new UserProfile();
    userProfile.userDisplayName = data.fullname;
    userProfile.personalEmail = data.email;
    userProfile.fullname = data.fullname;
    userProfile.birthday = new Date(data.birthday);
    userProfile.homeAddress = data.homeAddress;
    userProfile.personalEmail = data.email;
    userProfile.phoneNumber = data.phoneNumber;
    userProfile.gender = data.gender;
    userProfile.majorId = data.majorId;

    user.userProfile = userProfile;

    await this.userRepository.createNewUser(user);

    const result = await this.userRepository.findOne({
      filter: { userId: user.userId },
      relations: ['userProfile']
    });

    if (!result) {
      throw new Error('Failed to find the registered user');
    }

    const emailTemplatePath = path.join(__dirname, '../utils/email/success-email-template.util.ejs');

    const emailContent = await ejs.renderFile(emailTemplatePath, {
      fullname: data.fullname,
      email: email,
      otp: otp
    });

    await sendEmail({
      from: { name: 'GiaSuVLU' },
      to: { emailAddress: [email] },
      subject: 'Chúc mừng đăng ký tài khoản thành công',
      html: emailContent
    });

    // Xóa OTP khỏi Redis sau khi xác thực thành công
    await redis.del(`otp:${data.email}`);

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

    if (user.checkActive === UserCheckActiveEnum.BLOCKED) {
      throw new BaseError(ErrorCode.AUTH_01, 'User is blocked from logging in');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user!.password);

    if (!isPasswordValid) {
      throw new BaseError(ErrorCode.AUTH_01, 'Password is incorrect');
    }

    // Luu vao JWt
    const claim = new JwtClaimDto(user.userId, '', [], '');

    const token = jwt.sign(_.toPlainObject(claim), SECRET_KEY, {
      expiresIn: this.LOGIN_TOKEN_EXPIRE
    });

    const result = convertToDto(LoginUserRes, user);
    result.token = token;

    return result;
  }

  async getMicrosoftAuthUrl(): Promise<{ authUrl: string }> {
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${new URLSearchParams({
      client_id: MICROSOFT_CLIENT_ID,
      response_type: 'code',
      redirect_uri: MICROSOFT_REDIRECT_USER_URI,
      response_mode: 'query',
      scope: MICROSOFT_CLIENT_SCOPE
    }).toString()}`;

    return { authUrl };
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    if (!code || typeof code !== 'string' || !code.trim()) {
      throw new Error('Invalid or missing authorization code.');
    }
    const response = await axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        client_secret: MICROSOFT_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: MICROSOFT_REDIRECT_USER_URI
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data;
  }

  async loginMicrosoft(code: string): Promise<LoginUserRes> {
    if (!code || typeof code !== 'string' || !code.trim()) {
      throw new Error('Invalid or missing authorization code.');
    }

    // Bước 1: Gọi API Microsoft để lấy Access Token
    const tokenResponse = await axios.post<MicrosoftTokenRes>(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        client_secret: MICROSOFT_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: MICROSOFT_REDIRECT_USER_URI
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      throw new Error('Failed to retrieve access token from Microsoft');
    }

    const accessToken = tokenResponse.data.access_token;

    // Bước 2: Lấy thông tin người dùng từ Microsoft
    const userResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userResponse.data) {
      throw new Error('Failed to retrieve user information from Microsoft');
    }

    const microsoftUser = userResponse.data as {
      id: string;
      displayName: string;
      mail?: string;
      userPrincipalName: string;
      gender?: string;
      birthdate?: string;
    };

    const email = microsoftUser.mail || microsoftUser.userPrincipalName || `${microsoftUser.id}@microsoft.com`;

    // Bước 3: Kiểm tra User tồn tại
    let user = await this.userRepository.findOne({
      filter: { email: email },
      relations: ['userProfile']
    });

    if (!user) {
      user = new User();
      user.email = microsoftUser.mail || microsoftUser.userPrincipalName || `${microsoftUser.id}@microsoft.com`;
      user.phoneNumber = ''; // Cập nhật nếu có
      user.password = ''; // Nếu là login từ Microsoft, bạn có thể để trống hoặc bỏ qua
      user.microsoftId = microsoftUser.id;

      const userProfile = new UserProfile();
      userProfile.userDisplayName = microsoftUser.displayName || '';
      userProfile.fullname = microsoftUser.displayName || '';
      userProfile.personalEmail = microsoftUser.mail || '';
      userProfile.workEmail = microsoftUser.userPrincipalName || '';
      userProfile.homeAddress = '';
      userProfile.birthday = microsoftUser.birthdate ? new Date(microsoftUser.birthdate) : new Date();
      userProfile.gender =
        microsoftUser.gender === 'male' ? 'MALE' : microsoftUser.gender === 'female' ? 'FEMALE' : 'MALE';

      user.userProfile = userProfile;

      // Gọi createNewUser để tạo user với userId tự động
      await this.userRepository.createNewUser(user);
    }

    // Bước 4: Tạo JWT Token
    const claim = new JwtClaimDto(user.userId, '', [], '');
    const token = jwt.sign(_.toPlainObject(claim), SECRET_KEY, { expiresIn: this.LOGIN_TOKEN_EXPIRE });

    // Bước 5: Trả về thông tin User
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
    const phoneNumberExist = await this.exists({ filter: { phoneNumber: data.phoneNumber } });
    if (phoneNumberExist) {
      throw new Error('Phone number already exists');
    }

    const updatedUser = await this.userRepository.findOne({
      filter: { userId },
      relations: ['userProfile']
    });

    if (!updatedUser || !updatedUser.userProfile) {
      throw new Error('User profile not found');
    }

    const userProfileUpdatePayload: Partial<UserProfile> = {
      fullname: data.fullname,
      phoneNumber: data.phoneNumber,
      avatar: data.avatar,
      workEmail: data.workEmail,
      homeAddress: data.homeAddress,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      gender: data.gender,
      majorId: data.majorId
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

  async convertVNPhone(phone: string): Promise<string> {
    return phone.replace(/^0/, '+84');
  }

  async forgotPassword(data: ForgotPasswordUserReq): Promise<void> {
    let user: User | null = null;
    let isPhoneNumber = false;

    // Kiểm tra nếu input là số điện thoại
    if (/^\d{10,11}$/.test(data.emailOrPhoneNumber)) {
      user = await this.userRepository.findOne({ filter: { phoneNumber: data.emailOrPhoneNumber } });
      isPhoneNumber = true;
    } else {
      user = await this.userRepository.findOne({ filter: { email: data.emailOrPhoneNumber } });
    }

    if (!user) {
      throw new Error('User not found');
    }

    // Tạo mã OTP ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP vào Redis với key `otp:<email>`
    await redis.set(`otp:${user.email}`, otp, 'EX', 300);

    if (isPhoneNumber) {
      // Nếu input là số điện thoại, gửi OTP qua SMS
      const internationalPhone = await this.convertVNPhone(user.phoneNumber);
      sendSms(`Mã OTP của bạn là ${otp}`, [internationalPhone]);
    } else {
      // Nếu input là email, gửi OTP qua email
      const emailTemplatePath = path.join(__dirname, '../utils/email/otp-forgot-template.util.ejs');

      const emailContent = await ejs.renderFile(emailTemplatePath, {
        email: user.email,
        otp: otp
      });

      await sendEmail({
        from: { name: 'GiaSuVLU' },
        to: { emailAddress: [user.email] },
        subject: 'Tìm lại mật khẩu',
        html: emailContent
      });
    }
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

    //Logout after reset password
    await this.logout(user.userId);
    return response;
  }

  async getTutorLevelId(totalTestPoints: number): Promise<string> {
    if (totalTestPoints >= 17) return TutorLevelEnum.DIAMOND;
    if (totalTestPoints >= 13) return TutorLevelEnum.PLATINUM;
    if (totalTestPoints >= 9) return TutorLevelEnum.GOLD;
    if (totalTestPoints >= 5) return TutorLevelEnum.SILVER;
    return TutorLevelEnum.BRONZE;
  }

  async convertUserReqToTutor(existingUser: User, data: RegisToTutorReq): Promise<void> {
    existingUser.status = UserStatus.REQUEST;

    const tutorProfile = new TutorProfile();
    tutorProfile.userId = existingUser.userId;
    tutorProfile.avatar = data.avatar;
    tutorProfile.fullname = data.fullname;
    tutorProfile.majorId = data.majorId;
    tutorProfile.birthday = new Date(data.birthday);
    tutorProfile.gender = data.gender;
    tutorProfile.bankNumber = data.bankNumber;
    tutorProfile.bankName = data.bankName;
    tutorProfile.GPA = data.GPA;
    tutorProfile.evidenceOfGPA = data.evidenceOfGPA;
    tutorProfile.dateTimeLearn = data.dateTimeLearn.map((item) => JSON.stringify(item));
    tutorProfile.teachingTime = data.teachingTime;
    tutorProfile.description = data.description;
    tutorProfile.subjectId = data.subjectId;
    tutorProfile.evidenceOfSubject = data.evidenceOfSubject;
    tutorProfile.univercity = data.univercity;
    tutorProfile.videoUrl = data.videoUrl;
    tutorProfile.teachingTime = data.teachingTime;
    tutorProfile.descriptionOfSubject = data.descriptionOfSubject;
    tutorProfile.isUseCurriculumn = data.isUseCurriculumn;

    tutorProfile.subjectId2 = data.subjectId2;
    tutorProfile.evidenceOfSubject2 = data.evidenceOfSubject2;
    tutorProfile.descriptionOfSubject2 = data.descriptionOfSubject2;

    tutorProfile.subjectId3 = data.subjectId3;
    tutorProfile.evidenceOfSubject3 = data.evidenceOfSubject3;
    tutorProfile.descriptionOfSubject3 = data.descriptionOfSubject3;

    tutorProfile.teachingMethod = data.teachingMethod;
    tutorProfile.teachingPlace = data.teachingPlace;

    await this.tutorProfileRepository.save(tutorProfile);

    existingUser.tutorProfile = tutorProfile;
  }

  async regisToTutor(id: string, data: RegisToTutorReq): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      filter: {
        userId: id
      }
    });

    if (!existingUser) {
      throw new BaseError(ErrorCode.NF_01, 'User not found');
    }

    await this.convertUserReqToTutor(existingUser, data);
    await this.userRepository.save(existingUser);
  }

  async updateTutorProfile(id: string, data: UpdateTutorProfileReq): Promise<void> {
    const updatedUser = await this.userRepository.findOne({
      filter: { userId: id },
      relations: ['tutorProfile']
    });

    if (!updatedUser || !updatedUser.tutorProfile) {
      throw new Error('Tutor profile not found');
    }

    const tutorProfileUpdatePayload: Partial<TutorProfile> = {
      avatar: data.avatar,
      fullname: data.fullname,
      majorId: data.majorId,
      birthday: data.birthday ? new Date(data.birthday) : undefined,
      gender: data.gender,
      bankNumber: data.bankNumber,
      bankName: data.bankName,
      GPA: data.GPA,
      dateTimeLearn: data.dateTimeLearn?.map((item) => JSON.stringify(item)),
      teachingTime: data.teachingTime,
      description: data.description,
      subjectId: data.subjectId,
      univercity: data.univercity,
      videoUrl: data.videoUrl,
      descriptionOfSubject: data.descriptionOfSubject,
      isPublicProfile: data.isPublicProfile
    };
    Object.keys(tutorProfileUpdatePayload).forEach(
      (key) =>
        tutorProfileUpdatePayload[key as keyof TutorProfile] === undefined &&
        delete tutorProfileUpdatePayload[key as keyof TutorProfile]
    );

    await this.tutorProfileRepository.findOneAndUpdate({
      filter: { userId: id },
      updateData: tutorProfileUpdatePayload
    });

    await this.tutorSubjectRepository.findOneAndUpdate({
      filter: { tutorId: id },
      updateData: { subjectId: data.subjectId }
    });
  }

  async getListRequest(status: string, searchData: SearchDataDto): Promise<GetListRequestRes> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    where.status = status;

    const requests = await this.userRepository.findMany({
      filter: where,
      paging: paging,
      relations: ['tutorProfile'],
      order: order
    });

    requests.forEach((request) => {
      delete (request as any).password;
    });

    const total = await this.userRepository.count({ filter: where });

    const totalNewRequest = await this.userRepository.totalNewRequest();

    return {
      total: total,
      items: requests,
      counts: {
        totalRequest: total,
        totalNewRequest: totalNewRequest
      }
    };
  }

  async solveRequest(userId: string, click: string): Promise<void> {
    const checkStatus = await this.userRepository.findOne({
      filter: { status: UserStatus.REQUEST, userId: userId }
    });

    if (!checkStatus) {
      throw new Error('You cant solve request ');
    }

    if (!Object.values(UserStatus).includes(click as UserStatus)) {
      throw new Error('You need to transmit the correct data');
    }

    if (click === UserStatus.ACCEPT) {
      await this.userRepository.findOneAndUpdate({
        filter: { userId: userId },
        updateData: {
          roleId: UserTypeEnum.TUTOR,
          status: UserStatus.ACCEPT
        }
      });
    } else if (click === UserStatus.REFUSE) {
      await this.userRepository.findOneAndUpdate({
        filter: { userId: userId },
        updateData: {
          status: UserStatus.REFUSE
        }
      });
    }
  }

  async convertUpdateManageUser(data: UpdateManageUserReq): Promise<User> {
    const user = new User();
    user.status = data.status;
    user.roleId = data.roleId;
    user.checkActive = data.checkActive;

    if (data.tutorLevelId) {
      const tutorLevel = await this.tutorLevelRepository.findOne({
        filter: { tutorLevelId: data.tutorLevelId }
      });

      if (!tutorLevel) {
        throw new BaseError(ErrorCode.NF_01, 'Tutor Level not found');
      }

      // Tạo mới TutorProfile nếu chưa có
      if (!user.tutorProfile) {
        user.tutorProfile = new TutorProfile();
      }

      user.tutorProfile.tutorLevelId = data.tutorLevelId;
      user.tutorProfile.coinPerHours = tutorLevel.salary / 1000 - (tutorLevel.salary / 1000) * 0.1; // Công thức tính coinPerHours
    }

    return user;
  }

  async updateUserById(id: string, data: any): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      filter: {
        userId: id
      },
      relations: ['tutorProfile']
    });

    if (!existingUser) {
      throw new BaseError(ErrorCode.NF_01, 'User not found');
    }

    const userUpdate = await this.convertUpdateManageUser(data);
    const updatedData: User = { ...existingUser, ...userUpdate };

    await this.userRepository.save(updatedData);
  }

  async getListTutorPublic(searchData: SearchDataDto): Promise<GetListPublicTutorProfileRes> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    where.tutorProfile = {
      ...(where.tutorProfile || {}),
      isPublicProfile: true
    };

    const publics = await this.userRepository.findMany({
      filter: where,
      paging: paging,
      relations: ['tutorProfile'],
      order: order
    });

    publics.forEach((publicUser) => {
      delete (publicUser as any).password;
    });

    const total = await this.userRepository.count({ filter: where });

    return {
      total,
      items: publics,
      counts: {
        totalPublic: total
      }
    };
  }
}
