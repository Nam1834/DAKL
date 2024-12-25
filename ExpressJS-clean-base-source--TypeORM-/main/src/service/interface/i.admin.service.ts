import { BaseModelType } from '@/types/base-model.types';
import { IBaseCrudService } from './i.base.service';
import { CreateAdminRes } from '@/dto/admin/create-admin.res';
import { CreateAdminReq } from '@/dto/admin/create-admin.req';
import { LoginAdminReq } from '@/dto/admin/login-admin.req';
import { LoginAdminRes } from '@/dto/admin/login-admin.res';
import { GetProfileAdminRes } from '@/dto/admin/get-profile-admin.res';

export interface IAdminService<T extends BaseModelType> extends IBaseCrudService<T> {
  logout(adminId: string): Promise<void>;
  createAdmin(data: CreateAdminReq): Promise<CreateAdminRes>;
  login(data: LoginAdminReq): Promise<LoginAdminRes>;
  getProfile(adminId: string): Promise<GetProfileAdminRes>;
}
