import { Expose } from 'class-transformer';

export class MicrosoftTokenRes {
  @Expose()
  access_token!: string;

  @Expose()
  token_type!: string;

  @Expose()
  expires_in!: number;

  @Expose()
  scope!: string;

  @Expose()
  refresh_token?: string;

  @Expose()
  id_token?: string;
}
