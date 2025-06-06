import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { BaseModel } from './base.model';
import { Classroom } from './classroom.model';
import { MeetingStatus } from '@/enums/meeting-status.enum';

@Entity('meetings')
export class Meeting extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'meeting_id' })
  meetingId!: string;

  @Column({ type: 'varchar', unique: true, name: 'zoom_meeting_id', nullable: true })
  zoomMeetingId!: string;

  @Column({ type: 'varchar', nullable: true })
  topic!: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'start_time' })
  startTime!: Date;

  @Column({ type: 'int', nullable: true })
  duration!: number;

  @Column({ type: 'timestamptz', nullable: true, name: 'end_time' })
  endTime!: Date;

  @Column({ type: 'varchar', nullable: true, name: 'join_url' })
  joinUrl!: string;

  @Column({ type: 'varchar', nullable: true })
  password!: string;

  @Column('varchar', { length: 100, nullable: true })
  hostEmail!: string;

  @Column({ name: 'classroom_id', nullable: true })
  classroomId!: string;

  @ManyToOne(() => Classroom, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'classroom_id' })
  classroom!: Classroom;

  @Column({ type: 'timestamptz', nullable: true, name: 'user_join_time' })
  userJoinTime!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'user_left_time' })
  userLeftTime!: Date;

  @Column({ default: MeetingStatus.IN_SESSION })
  status!: string;
}
