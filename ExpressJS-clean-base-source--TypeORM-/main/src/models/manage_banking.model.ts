import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { TutorProfile } from './tutor_profile.model';
import { BaseModel } from './base.model';
import { ManageBankingStatus } from '@/enums/manage-banking-status.enum';

@Entity('manage_bankings')
export class ManageBanking extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'manage_banking_id' })
  manageBankingId!: string;

  @Column({ name: 'tutor_id' })
  tutorId!: string;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;

  @Column({ name: 'coin_withdraw' })
  coinWithdraw!: number;

  @Column({ name: 'got_value' })
  gotValue!: number;

  @Column({ default: ManageBankingStatus.REQUEST })
  status!: string;
}
