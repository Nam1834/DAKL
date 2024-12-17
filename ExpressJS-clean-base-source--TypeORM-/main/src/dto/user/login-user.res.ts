import { Expose } from 'class-transformer';

export class LoginUserRes {
  @Expose()
  userId!: string;

  @Expose()
  token!: string;
}
