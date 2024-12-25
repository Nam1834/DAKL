import { Expose } from 'class-transformer';

export class LoginAdminRes {
  @Expose()
  adminId!: string;

  @Expose()
  token!: string;
}
