import { Expose } from 'class-transformer';

export class CreateMeetingRes {
  @Expose()
  meetingId!: string;

  @Expose()
  microsoftMeetingId!: string;

  @Expose()
  topic?: string;

  @Expose()
  startTime!: Date;

  @Expose()
  joinUrl?: string;
}
