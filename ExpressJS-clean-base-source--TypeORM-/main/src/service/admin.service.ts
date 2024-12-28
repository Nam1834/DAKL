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
import _, { filter } from 'lodash';
import { GetProfileAdminRes } from '@/dto/admin/get-profile-admin.res';
import { AdminStatus } from '@/enums/admin-status.enum';
import { INotificationService } from './interface/i.notification.service';
import { IRolePermissionRepository } from '@/repository/interface/i.role_permission.repository';
import { RolePermission } from '@/models/role_permission.model';
import { Notification } from '@/models/notification.model';
import { IRoleRepository } from '@/repository/interface/i.role.repository';
import { Role } from '@/models/role.model';
import { IPermissionRepository } from '@/repository/interface/i.permission.repository';
import { Permission } from '@/models/permission.model';
import { roleRepository } from '@/container/role.container';
import { SearchDataDto } from '@/dto/search-data.dto';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { SearchUtil } from '@/utils/search.util';

const SECRET_KEY: any = process.env.SECRET_KEY;

@injectable()
export class AdminService extends BaseCrudService<Admin> implements IAdminService<Admin> {
  private adminRepository: IAdminRepository<Admin>;
  private adminProfileRepository: IAdminProfileRepository<AdminProfile>;
  private roleRepository: IRoleRepository<Role>;
  private notificationService: INotificationService<Notification>;
  private rolePermissionRepository: IRolePermissionRepository<RolePermission>;
  private permissionRepository: IPermissionRepository<Permission>;

  private LOGIN_TOKEN_EXPIRE = 8 * 60 * 60;

  constructor(
    @inject('NotificationService')
    notificationService: INotificationService<Notification>,
    @inject('AdminRepository') adminRepository: IAdminRepository<Admin>,
    @inject('AdminProfileRepository') adminProfileRepository: IAdminProfileRepository<AdminProfile>,
    @inject('PermissionRepository')
    permissionRepository: IPermissionRepository<Permission>,
    @inject('RolePermissionRepository') rolePermissionRepository: IRolePermissionRepository<RolePermission>,
    @inject('RoleRepository') roleRepository: IRoleRepository<Role>
  ) {
    super(adminRepository);
    this.adminRepository = adminRepository;
    this.adminProfileRepository = adminProfileRepository;
    this.permissionRepository = permissionRepository;
    this.notificationService = notificationService;
    this.rolePermissionRepository = rolePermissionRepository;
    this.roleRepository = roleRepository;
  }

  async search(searchData: SearchDataDto): Promise<PagingResponseDto<Admin>> {
    const { where, order, paging } = SearchUtil.getWhereCondition(searchData);

    const admin = await this.adminRepository.findMany({
      filter: where,
      order: order,
      paging: paging,
      relations: ['adminProfile']
    });

    admin.forEach((admin) => {
      delete (admin as any).password;
    });

    const total = await this.adminRepository.count({
      filter: where
    });

    return new PagingResponseDto(total, admin);
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

  async convertCreateAdminReqToAdmin(data: CreateAdminReq): Promise<Admin> {
    const admin = new Admin();
    admin.email = data.email;
    admin.phoneNumber = data.phoneNumber;
    admin.password = await bcrypt.hash(data.password, 10);
    admin.roleId = data.roleId;
    admin.status = AdminStatus.ACTIVE;

    const adminProfile = new AdminProfile();
    adminProfile.adminDisplayName = data.fullname;
    adminProfile.personalEmail = data.email;
    adminProfile.fullname = data.fullname;
    adminProfile.birthday = new Date(data.birthday);
    adminProfile.homeAddress = data.homeAddress;
    adminProfile.personalEmail = data.email;
    adminProfile.phoneNumber = data.phoneNumber;
    adminProfile.gender = data.gender;

    admin.adminProfile = adminProfile;

    return admin;
  }

  async createAdmin(data: CreateAdminReq): Promise<CreateAdminRes> {
    const emailExist = await this.exists({
      filter: { email: data.email }
    });
    if (emailExist) {
      throw new BaseError(ErrorCode.ALREADY_EXISTS, 'Email has exist');
    }

    const phoneNumberExist = await this.exists({
      filter: { phoneNumber: data.phoneNumber }
    });
    if (phoneNumberExist) {
      throw new BaseError(ErrorCode.ALREADY_EXISTS, 'Phone Number has exist');
    }

    const existRole = await this.roleRepository.exists({
      filter: { roleId: data.roleId }
    });
    if (!existRole) {
      throw new Error('Role does not exist');
    }

    const admin = await this.convertCreateAdminReqToAdmin(data);

    await this.adminRepository.save(admin);

    return convertToDto(CreateAdminRes, admin);
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

    const rolePermission = await this.rolePermissionRepository.findMany({
      filter: {
        roleId: admin.roleId
      }
    });

    const rolePermissionIds = rolePermission!.map((permission) => permission.permissionId) || [''];

    // Luu vao JWt
    const claim = new JwtClaimDto(admin.adminId, '', rolePermissionIds, admin.roleId);

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
