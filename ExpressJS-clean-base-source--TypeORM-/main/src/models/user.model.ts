import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  OneToOne,
  ManyToOne,
  JoinColumn,
  PrimaryColumn
} from 'typeorm';
import { BaseModel } from './base.model';
import { UserProfile } from './user_profile.model';
import { Role } from './role.model';
import { UserTypeEnum } from '@/enums/user-type.enum';
import { UserStatus } from '@/enums/user-status.enum';
import { TutorProfile } from './tutor_profile.model';
import { UserCheckActiveEnum } from '@/enums/user-check-active.enum';
import { TestResult } from './test_result.model';

@Entity('users')
export class User extends BaseModel {
  @PrimaryColumn({ name: 'user_id' })
  userId!: string;

  @Index({ unique: true })
  @Column('varchar', { length: 100 })
  email!: string;

  @Column('varchar', { length: 15, name: 'phone_number', nullable: true })
  phoneNumber!: string;

  @Column('varchar', { length: 100, nullable: true })
  password!: string;

  @Column({ name: 'microsoft_id', nullable: true })
  microsoftId?: string;

  @OneToOne(() => UserProfile, (user_profile) => user_profile.user, { cascade: true })
  userProfile!: UserProfile;

  @OneToOne(() => TutorProfile, (tutor_profile) => tutor_profile.user, { cascade: true })
  tutorProfile!: TutorProfile;

  @Column({ name: 'role_id', nullable: true, default: UserTypeEnum.USER })
  roleId!: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column({ nullable: true, default: UserStatus.PENDING })
  status?: string;

  @Column({ nullable: true, default: UserCheckActiveEnum.ACTIVE })
  checkActive?: string;

  @Column({ name: 'coin', default: 0 })
  coin!: number;

  @OneToOne(() => TestResult, (testResult) => testResult.user)
  testResults!: TestResult;

  @Column({ name: 'total_test_points', type: 'int', default: 0 })
  totalTestPoints!: number;
}
