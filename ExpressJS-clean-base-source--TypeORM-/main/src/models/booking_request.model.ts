import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';
import { TutorProfile } from './tutor_profile.model';
import { BaseModel } from './base.model';
import { UserProfile } from './user_profile.model';
import { BookingRequestStatus } from '@/enums/booking_request-status.enum';

@Entity('booking_requests')
export class BookingRequest extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'booking_request_id' })
  bookingRequestId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserProfile, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfile;

  @Column({ name: 'tutor_id' })
  tutorId!: string;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;

  @Column({ name: 'date_time_learn', type: 'json' })
  dateTimeLearn!: string[];

  @Column({ name: 'lessons_per_week', type: 'int' })
  lessonsPerWeek!: number;

  @Column({ name: 'total_lessons', type: 'int' })
  totalLessons!: number;

  @Column({ name: 'hours_per_lesson', type: 'decimal', precision: 3, scale: 2 })
  hoursPerLesson!: number;

  @Column({ name: 'total_coins', type: 'int' })
  totalcoins!: number;

  @Column({ name: 'start_day', type: 'date' })
  startDay!: Date;

  @Column({ default: BookingRequestStatus.REQUEST })
  status!: string;

  @Column({ name: 'note_of_tutor', nullable: true })
  noteOfTutor!: string;
}
