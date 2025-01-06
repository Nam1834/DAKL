import { Expose, Type } from 'class-transformer';

export class GetListMajorRes {
  @Expose()
  majorId!: string;

  @Expose()
  majorName!: string;

  @Expose()
  createdAt!: Date;
}
