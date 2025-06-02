import { Expose } from 'class-transformer';

export class GetMeetingRes {
  @Expose()
  meetingId!: string;

  @Expose()
  zoomMeetingId!: string;

  @Expose()
  topic!: string;

  @Expose()
  startTime!: Date;

  @Expose()
  duration?: string;

  @Expose()
  endTime?: string;

  @Expose()
  joinUrl?: string;

  @Expose()
  password?: string;

  @Expose()
  userJoinTime?: string;

  @Expose()
  userLeftTime?: string;

  @Expose()
  status?: string;
}
