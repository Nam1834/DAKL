import { Expose, Type } from 'class-transformer';

export class ZoomTokenRes {
  @Expose()
  id!: string;

  @Expose()
  access_token!: string;

  @Expose()
  refresh_token!: string;
}
