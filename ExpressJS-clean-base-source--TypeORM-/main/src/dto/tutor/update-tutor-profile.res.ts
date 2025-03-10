import { Expose } from 'class-transformer';

export class UpdateTutorProfileRes {
  @Expose()
  fullname!: string;

  @Expose()
  avatar?: string;

  @Expose()
  majorId!: string;

  @Expose()
  birthday?: Date;

  @Expose()
  gender!: 'MALE' | 'FEMALE';

  @Expose()
  bankNumber?: string;

  @Expose()
  bankName?: string;

  @Expose()
  GPA?: number;

  @Expose()
  dateTimeLearn?: string[];

  @Expose()
  teachingTime?: string;

  @Expose()
  description?: string;

  @Expose()
  subjectId!: string;

  @Expose()
  univercity?: string;

  @Expose()
  GPAOrNameDegree?: string;

  @Expose()
  educationalCertification?: string;

  @Expose()
  videoUrl?: string;

  @Expose()
  descriptionOfSubject?: string;

  @Expose()
  isPublicProfile!: boolean;
}
