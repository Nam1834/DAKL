import { Expose, Type } from 'class-transformer';

export class ZoomMeetingRes {
  @Expose()
  zoomMeetingId!: string;

  @Expose()
  topic!: string;

  @Expose()
  microsoftMeetingId!: string;

  @Expose()
  join_url!: string;

  @Expose()
  start_time!: string;

  @Expose()
  password!: string;
}
