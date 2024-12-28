import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { AdminProfile } from './admin_profile.model';
import { Role } from './role.model';
import { AdminTypeEnum } from '@/enums/admin-type.enum';
@Entity('admins')
export class Admin extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'admin_id' })
  adminId!: string;

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

  @OneToOne(() => AdminProfile, (admin_profile) => admin_profile.admin, { cascade: true })
  adminProfile!: AdminProfile;

  @Column({ name: 'role_id', nullable: true })
  roleId!: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column('varchar', { length: 30, nullable: true })
  status!: string;
}
