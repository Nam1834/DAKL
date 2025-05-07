import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';
import { TutorProfile } from './tutor_profile.model';
import { BaseModel } from './base.model';
import { UserProfile } from './user_profile.model';
import { ClassroomStatus } from '@/enums/classroom-status.enum';

@Entity('manage_payments')
export class ManagePayment extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'manage_payment_id' })
  managePaymentId!: string;

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

  @Column({ name: 'coin_of_user_payment' })
  coinOfUserPayment!: number;

  @Column({ name: 'coin_of_tutor_receive' })
  coinOfTutorReceive!: number;

  @Column({ name: 'coin_of_web_receive' })
  coinOfWebReceive!: number;
}
