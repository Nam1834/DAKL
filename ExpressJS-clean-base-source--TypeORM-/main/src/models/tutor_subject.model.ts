import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Subject } from './subject.model';
import { TutorProfile } from './tutor_profile.model';
import { BaseModel } from './base.model';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Entity('tutor_subjects')
export class TutorSubject extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'tutor_subject_id' })
  tutorSubjectId!: string;

  @Column({ type: 'uuid', name: 'tutor_id' })
  tutorId!: string;

  @Column({ name: 'subject_id' })
  subjectId!: string;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;
}
