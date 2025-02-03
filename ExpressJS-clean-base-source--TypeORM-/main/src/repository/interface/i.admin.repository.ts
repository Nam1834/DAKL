import { Admin } from '@/models/admin.model';
import { IBaseRepository } from '@/repository/interface/i.base.repository';

export interface IAdminRepository<T> extends IBaseRepository<T> {
  createNewAdmin(admin: Admin): Promise<void>;
  totalNewAdmin(): Promise<number>;
}
