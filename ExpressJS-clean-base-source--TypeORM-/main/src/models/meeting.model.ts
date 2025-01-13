import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('meetings')
export class Meeting extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'meeting_id' })
  meetingId!: string;

  @Column({ type: 'varchar', unique: true, name: 'microsoft_meeting_id' })
  microsoftMeetingId!: string;

  @Column({ type: 'varchar', nullable: true })
  topic!: string;

  @Column({ type: 'timestamp', nullable: true, name: 'start_time' })
  startTime!: Date;

  @Column({ type: 'int', nullable: true })
  duration!: number;

  @Column({ type: 'timestamp', nullable: true, name: 'end_time' })
  endTime!: Date;

  @Column({ type: 'varchar', nullable: true, name: 'join_url' })
  joinUrl!: string;

  @Column({ type: 'varchar', nullable: true })
  password!: string;
}
