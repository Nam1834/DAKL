import { Admin } from '@/models/admin.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IAdminRepository<T> extends IBaseRepository<T> {
  checkEmail(email: string, id: string): Promise<void>;
  checkPhoneNumber(phoneNumber: string, id: string): Promise<void>;
  createNewAdmin(admin: Admin): Promise<void>;
  totalNewAdmin(): Promise<number>;
}
