import { Expose, Type } from 'class-transformer';

export class MicrosoftMeetingRes {
  @Expose()
  topic!: string;

  @Expose()
  microsoftMeetingId!: string;

  @Expose()
  joinUrl!: string;

  @Expose()
  start_time!: string;
}
