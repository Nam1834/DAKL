import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Subject } from './subject.model';
import { TutorProfile } from './tutor_profile.model';
import { BaseModel } from './base.model';

@Entity('tutor_subjects')
export class TutorSubject extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'tutor_subject_id' })
  tutorSubjectId!: number;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'subject_id' })
  subjectId!: string;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  tutor!: TutorProfile;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;
}
