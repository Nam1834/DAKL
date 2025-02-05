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

  private LOGIN_TOKEN_EXPIRE = 3 * 60 * 60;

  constructor(
    @inject('UserRepository') userRepository: IUserRepository<User>,
    @inject('UserProfileRepository') userProfileRepository: IUserProfileRepository<UserProfile>,
    @inject('TutorProfileRepository') tutorProfileRepository: ITutorProfileRepository<TutorProfile>,
    @inject('MyCurriculumnRepository') myCurriculumnRepository: IMyCurriculumnRepository<MyCurriculumn>,
    @inject('CurriculumnRepository') curriculumnRepository: ICurriculumnRepository<Curriculumn>,
    @inject('MyCurriculumnItemRepository') myCurriculumnItemRepository: IMyCurriculumnItemRepository<MyCurriculumnItem>
  ) {
    super(userRepository);
    this.userRepository = userRepository;
    this.userProfileRepository = userProfileRepository;
    this.tutorProfileRepository = tutorProfileRepository;
    this.myCurriculumnRepository = myCurriculumnRepository;
    this.curriculumnRepository = curriculumnRepository;
    this.myCurriculumnItemRepository = myCurriculumnItemRepository;
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

  async register(data: RegisterUserReq): Promise<RegisterUserRes> {
    const emailExist = await this.exists({
      filter: { email: data.email }
    });
    if (emailExist) {
      throw new Error('Email has exist');
    }

    const phoneNumberExist = await this.exists({
      filter: { phoneNumber: data.phoneNumber }
    });
    if (phoneNumberExist) {
      throw new Error('Phone Number has exist');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const userProfile = new UserProfile();
    userProfile.userDisplayName = data.fullname;
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
      from: { name: 'GiaSuVLU' },
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

    // Bước 3: Kiểm tra User tồn tại
    let user = await this.userRepository.findOne({
      filter: { microsoftId: microsoftUser.id },
      relations: ['userProfile']
    });

    if (!user) {
      user = await this.userRepository.create({
        data: {
          email: microsoftUser.mail || microsoftUser.userPrincipalName || `${microsoftUser.id}@microsoft.com`,
          phoneNumber: '',
          password: '',
          microsoftId: microsoftUser.id,
          userProfile: {
            userDisplayName: microsoftUser.displayName || '',
            fullname: microsoftUser.displayName || '',
            personalEmail: microsoftUser.mail || '',
            workEmail: microsoftUser.userPrincipalName || '',
            homeAddress: '',
            birthday: undefined,
            gender: microsoftUser.gender ? (microsoftUser.gender === 'male' ? 'MALE' : 'FEMALE') : undefined
          }
        }
      });

      // Lưu User và UserProfile vào database trong một thao tác
      await this.userRepository.save(user);
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

    //Logout after reset password
    await this.logout(user.userId);
    return response;
  }

  async convertUserReqToTutor(
    existingUser: User,
    data: RegisToTutorReq
  ): Promise<{ user: User; myCurriculumn: MyCurriculumn }> {
    existingUser.status = UserStatus.REQUEST;

    const tutorProfile = new TutorProfile();
    tutorProfile.avatar = data.avatar;
    tutorProfile.majorName = data.majorName;
    tutorProfile.teachingCetification = data.teachingCetification;
    tutorProfile.degree = data.degree;
    tutorProfile.univercity = data.univercity;
    tutorProfile.GPA = data.GPA;
    tutorProfile.educationalCertification = data.educationalCertification;
    tutorProfile.dateTimeLearn = data.dateTimeLearn.map((item) => JSON.stringify(item));
    tutorProfile.teachingTime = data.teachingTime;
    tutorProfile.amount = data.amount;
    tutorProfile.teachingRoadMap = data.teachingRoadMap;
    tutorProfile.description = data.description;
    tutorProfile.videoUrl = data.videoUrl;
    tutorProfile.teachingMethod = data.teachingMethod;

    existingUser.tutorProfile = tutorProfile;

    let myCurriculumn = await this.myCurriculumnRepository.findOne({
      filter: { userId: existingUser.userId }
    });

    if (myCurriculumn) {
      // Xóa toàn bộ MyCurriculumnItem cũ
      await this.myCurriculumnItemRepository.findOneAndHardDelete({
        filter: { myCurriculumnId: myCurriculumn.myCurriculumnId }
      });

      // Reset danh sách items
      myCurriculumn.items = [];
    } else {
      // Nếu chưa có, tạo mới MyCurriculumn
      myCurriculumn = new MyCurriculumn();
      myCurriculumn.user = existingUser;
    }

    // Tạo mới Curriculumn
    const curriculumn = new Curriculumn();
    curriculumn.curriculumnName = data.curriculumn.curriculumnName;
    curriculumn.curriculumnMajor = data.curriculumn.curriculumnMajor;
    curriculumn.curriculumnUrl = data.curriculumn.curriculumnUrl;
    curriculumn.description = data.curriculumn.description;
    curriculumn.roleUserCreated = existingUser.roleId;

    await this.curriculumnRepository.save(curriculumn);

    // Tạo mới MyCurriculumnItem
    const myCurriculumnItem = new MyCurriculumnItem();
    myCurriculumnItem.curriculumn = curriculumn;
    myCurriculumnItem.curriculumnId = curriculumn.curriculumnId;

    // Gán MyCurriculumnItem mới vào MyCurriculumn
    myCurriculumn.items.push(myCurriculumnItem);

    if (!existingUser.userId) {
      throw new Error('User ID is not set');
    }

    return { user: existingUser, myCurriculumn };
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

    const { user, myCurriculumn } = await this.convertUserReqToTutor(existingUser, data);
    const updatedUser: User = { ...existingUser, ...user };

    await this.userRepository.save(updatedUser);
    await this.myCurriculumnRepository.save(myCurriculumn);
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
}
