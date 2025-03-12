import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { TutorProfile } from './tutor_profile.model';

@Entity('tutor_levels')
export class TutorLevel extends BaseModel {
  @PrimaryColumn({ name: 'tutor_level_id' })
  tutorLevelId!: string;

  @Column({ name: 'level_name' })
  levelName!: string;

  @Column('int')
  salary!: number;

  @Column({ type: 'text' })
  description!: string;

  @OneToMany(() => TutorProfile, (tutor) => tutor.tutorLevel)
  tutors!: TutorProfile[];
}
