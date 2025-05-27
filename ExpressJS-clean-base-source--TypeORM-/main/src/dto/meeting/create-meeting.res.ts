import { Expose } from 'class-transformer';

export class CreateMeetingRes {
  @Expose()
  meetingId!: string;

  @Expose()
  zoomMeetingId!: string;

  @Expose()
  topic!: string;

  @Expose()
  startTime!: Date;

  @Expose()
  joinUrl?: string;
}
