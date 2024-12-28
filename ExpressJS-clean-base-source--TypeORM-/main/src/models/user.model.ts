import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { UserProfile } from './user_profile.model';
import { Role } from './role.model';
import { UserTypeEnum } from '@/enums/user-type.enum';

@Entity('users')
export class User extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId!: string;

  @Index({ unique: true })
  @Column('varchar', { length: 100 })
  email!: string;

  @Index({ unique: true })
  @Column('varchar', { length: 15, name: 'phone_number' })
  phoneNumber!: string;

  @Column('varchar', { length: 100 })
  password!: string;

  @Column({ name: 'microsoft_id', nullable: true })
  microsoftId?: string;

  @OneToOne(() => UserProfile, (user_profile) => user_profile.user, { cascade: true })
  userProfile!: UserProfile;

  @Column({ name: 'role_id', nullable: true, default: UserTypeEnum.USER })
  roleId!: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
