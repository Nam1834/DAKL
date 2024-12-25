import { Expose } from 'class-transformer';

export class CreateAdminRes {
  @Expose()
  adminId!: string;

  @Expose()
  email!: string;

  @Expose()
  phoneNumber!: string;
}
