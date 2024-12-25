import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { Admin } from './admin.model';

@Entity('admin_profiles')
export class AdminProfile extends BaseModel {
  @PrimaryColumn({
    name: 'admin_id'
  })
  adminId!: string;

  @OneToOne(() => Admin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin!: Admin;

  @Column('varchar', { length: 100, name: 'admin_display_name' })
  adminDisplayName!: string;

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

  @Column('varchar', { length: 255, name: 'home_address' })
  homeAddress!: string;

  @Column('date')
  birthday!: Date;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE'], default: 'MALE' })
  gender!: 'MALE' | 'FEMALE';
}
