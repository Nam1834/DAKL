import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseModel } from './base.model';
import { TutorProfile } from './tutor_profile.model';

@Entity('tutor_levels')
export class TutorLevel extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'tutor_level_id' })
  tutorLevelId!: number;

  @Column({ name: 'level_name' })
  levelName!: string;

  @Column('int')
  salary!: number;

  @Column({ type: 'text' })
  description!: string;

  @OneToMany(() => TutorProfile, (tutor) => tutor.tutorLevel)
  tutors!: TutorProfile[];
}
