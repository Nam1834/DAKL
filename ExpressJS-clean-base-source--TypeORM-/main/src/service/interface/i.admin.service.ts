import { BaseModelType } from '@/types/base-model.types';
import { IBaseCrudService } from './i.base.service';
import { CreateAdminRes } from '@/dto/admin/create-admin.res';
import { CreateAdminReq } from '@/dto/admin/create-admin.req';
import { LoginAdminReq } from '@/dto/admin/login-admin.req';
import { LoginAdminRes } from '@/dto/admin/login-admin.res';
import { GetProfileAdminRes } from '@/dto/admin/get-profile-admin.res';
import { SearchDataDto } from '@/dto/search-data.dto';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { Admin } from '@/models/admin.model';

export interface IAdminService<T extends BaseModelType> extends IBaseCrudService<T> {
  search(searchData: SearchDataDto): Promise<PagingResponseDto<Admin>>;
  logout(adminId: string): Promise<void>;
  createAdmin(data: CreateAdminReq): Promise<CreateAdminRes>;
  getMicrosoftAuthUrl(): Promise<{ authUrl: string }>;
  loginMicrosoft(code: string): Promise<LoginAdminRes>;
  login(data: LoginAdminReq): Promise<LoginAdminRes>;
  getProfile(adminId: string): Promise<GetProfileAdminRes>;
  updateAdmin(id: string, data: any): Promise<void>;
  updateAdminById(id: string, data: any): Promise<void>;
}
