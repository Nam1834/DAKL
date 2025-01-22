import { Expose, Type } from 'class-transformer';

export class GetListCurriculumnRes {
  @Expose()
  curriculumnId!: string;

  @Expose()
  curriculumnName!: string;

  @Expose()
  curriculumnMajor!: string;

  @Expose()
  status!: string;

  @Expose()
  roleUserCreated!: string;
}
