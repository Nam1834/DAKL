import { Admin } from '@/models/admin.model';
import { IAdminRepository } from '@/repository/interface/i.admin.repository';
import { BaseCrudService } from '@/service/base/base.service';
import { inject, injectable } from 'inversify';
import { IAdminService } from './interface/i.admin.service';
import { IAdminProfileRepository } from '@/repository/interface/i.admin_profile.repository';
import { AdminProfile } from '@/models/admin_profile.model';
import redis from '@/utils/redis/redis.util';
import moment from 'moment';
import { RedisSchemaEnum } from '@/enums/redis-schema.enum';
import { CreateAdminReq } from '@/dto/admin/create-admin.req';
import { CreateAdminRes } from '@/dto/admin/create-admin.res';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import bcrypt from 'bcrypt';
import BaseError from '@/utils/error/base.error';
import { ErrorCode } from '@/enums/error-code.enums';
import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import jwt from 'jsonwebtoken';
import { LoginAdminReq } from '@/dto/admin/login-admin.req';
import { LoginAdminRes } from '@/dto/admin/login-admin.res';
import _ from 'lodash';
import { GetProfileAdminRes } from '@/dto/admin/get-profile-admin.res';

const SECRET_KEY: any = process.env.SECRET_KEY;

@injectable()
export class AdminService extends BaseCrudService<Admin> implements IAdminService<Admin> {
  private adminRepository: IAdminRepository<Admin>;
  private adminProfileRepository: IAdminProfileRepository<AdminProfile>;

  private LOGIN_TOKEN_EXPIRE = 8 * 60 * 60;

  constructor(
    @inject('AdminRepository') adminRepository: IAdminRepository<Admin>,
    @inject('AdminProfileRepository') adminProfileRepository: IAdminProfileRepository<AdminProfile>
  ) {
    super(adminRepository);
    this.adminRepository = adminRepository;
    this.adminProfileRepository = adminProfileRepository;
  }

  async logout(adminId: string): Promise<void> {
    /*
    Set token logout time => check token logout time when authenticate
    And if token logout time >= token iat => not allow access
    Also set expire time for this key to make sure that the token will be deleted after a period of time = token expire time
    */
    const currentTimeStamp = moment().unix();

    await redis.set(`${RedisSchemaEnum.logoutTokenTime}:${adminId}`, currentTimeStamp, 'EX', this.LOGIN_TOKEN_EXPIRE);

    return;
  }

  async createAdmin(data: CreateAdminReq): Promise<CreateAdminRes> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const adminProfile = new AdminProfile();
    adminProfile.adminDisplayName = data.fullname;
    adminProfile.personalEmail = data.email;
    adminProfile.fullname = data.fullname;
    adminProfile.birthday = new Date(data.birthday);
    adminProfile.homeAddress = data.homeAddress;
    adminProfile.personalEmail = data.email;
    adminProfile.phoneNumber = data.phoneNumber;
    adminProfile.gender = data.gender;

    (data as unknown as Admin).adminProfile = adminProfile;

    const admin = await this.adminRepository.create({
      data: data
    });

    const result = await this.adminRepository.findOne({
      filter: { adminId: admin.adminId },
      relations: ['adminProfile']
    });

    if (!result) {
      throw new Error('Failed to find the registered admin');
    }

    return convertToDto(CreateAdminRes, result);
  }

  async login(data: LoginAdminReq): Promise<LoginAdminRes> {
    let admin: Admin | null = null;

    if (/^\d{10,11}$/.test(data.emailOrPhoneNumber)) {
      admin = await this.adminRepository.findOne({
        filter: { phoneNumber: data.emailOrPhoneNumber }
      });
    } else {
      admin = await this.adminRepository.findOne({
        filter: { email: data.emailOrPhoneNumber }
      });
    }

    if (!admin) {
      throw new Error('Admin not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, admin!.password);

    if (!isPasswordValid) {
      throw new BaseError(ErrorCode.AUTH_01, 'Password is incorrect');
    }

    // Luu vao JWt
    const claim = new JwtClaimDto(admin.adminId, '', [], '');

    const token = jwt.sign(_.toPlainObject(claim), SECRET_KEY, {
      expiresIn: this.LOGIN_TOKEN_EXPIRE
    });

    const result = convertToDto(LoginAdminRes, admin);
    result.token = token;

    return result;
  }

  async getProfile(adminId: string): Promise<GetProfileAdminRes> {
    const admin = await this.adminRepository.findOne({
      filter: { adminId },
      relations: ['adminProfile']
    });

    if (!admin || !admin.adminProfile) {
      throw new Error('Admin profile not found');
    }

    return admin.adminProfile;
  }
}
