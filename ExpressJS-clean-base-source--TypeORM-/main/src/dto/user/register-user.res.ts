import { Expose } from 'class-transformer';

export class RegisterUserRes {
  @Expose()
  userId!: string;

  @Expose()
  email!: string;

  @Expose()
  phoneNumber!: string;
}
