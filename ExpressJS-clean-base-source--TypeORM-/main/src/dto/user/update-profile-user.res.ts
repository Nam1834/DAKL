import { Expose } from 'class-transformer';

export class UpdateProfileUserRes {
  @Expose()
  fullname!: string;

  @Expose()
  avatar?: string;

  @Expose()
  personalEmail!: string;

  @Expose()
  workEmail!: string;

  @Expose()
  phoneNumber!: string;

  @Expose()
  homeAddress!: string;

  @Expose()
  birthday?: Date;

  @Expose()
  gender!: 'MALE' | 'FEMALE';

  @Expose()
  majorId!: string;
}
