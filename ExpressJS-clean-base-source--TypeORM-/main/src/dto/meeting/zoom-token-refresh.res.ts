import { Expose, Type } from 'class-transformer';

export class ZoomTokenRefreshRes {
  @Expose()
  access_token!: string;

  @Expose()
  refresh_token!: string;
}
