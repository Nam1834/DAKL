import { Expose } from 'class-transformer';

export class ResetPasswordRes {
  @Expose()
  userId!: string;

  @Expose()
  message!: string;
}
