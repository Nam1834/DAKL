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

  @ManyToOne(() => UserProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfile;

  @Column({ name: 'tutor_id' })
  tutorId!: string;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;

  @Column({ name: 'day_time_learn', type: 'json' })
  dayTimeLearn!: string[];

  @Column({ name: 'lessons_per_week', type: 'int' })
  lessonsPerWeek!: number;

  @Column({ name: 'total_lessons', type: 'int' })
  totalLessons!: number;

  @Column({ name: 'hours_per_lesson', type: 'decimal', precision: 3, scale: 1 })
  hoursPerLesson!: number;

  @Column({ name: 'start_day', type: 'date' })
  startDay!: Date;

  @Column({ default: BookingRequestStatus.PENDING })
  status!: string;
}
