import { Expose, Type } from 'class-transformer';

export class ZoomTokenRes {
  @Expose()
  access_token!: string;
}
