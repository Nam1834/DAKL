import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { User } from './user.model';
import { Major } from './major.model';

@Entity('user_profiles')
export class UserProfile extends BaseModel {
  @PrimaryColumn({
    name: 'user_id'
  })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('varchar', { length: 100, name: 'user_display_name', nullable: true })
  userDisplayName?: string;

  @Column('varchar', { length: 100 })
  fullname!: string;

  @Column('text', { nullable: true })
  avatar?: string;

  @Column('varchar', { nullable: true, length: 100, name: 'personal_email' })
  personalEmail!: string;

  @Column('varchar', { nullable: true, length: 100, name: 'work_email' })
  workEmail!: string;

  @Column('varchar', { nullable: true, length: 15, name: 'phone_number' })
  phoneNumber!: string;

  @Column('varchar', { length: 255, name: 'home_address', nullable: true })
  homeAddress!: string;

  @Column('date', { nullable: true })
  birthday?: Date;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE'], nullable: true })
  gender!: 'MALE' | 'FEMALE';

  @Column({ nullable: true, name: 'major_id' })
  majorId!: string;

  @ManyToOne(() => Major, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'major_id' })
  major!: Major;
}
