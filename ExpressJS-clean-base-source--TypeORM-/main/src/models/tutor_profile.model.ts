import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { User } from './user.model';
import { TutorSubject } from './tutor_subject.model';
import { TutorLevel } from './tutor_level.model';
import { Major } from './major.model';
import { Subject } from './subject.model';

@Entity('tutor_profiles')
export class TutorProfile extends BaseModel {
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('text', { nullable: true })
  avatar?: string;

  @Column('varchar', { length: 100, nullable: true })
  fullname!: string;

  @Column({ nullable: true, name: 'major_id' })
  majorId!: string;

  @ManyToOne(() => Major, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'major_id' })
  major!: Major;

  @Column('date', { nullable: true })
  birthday?: Date;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE'], nullable: true })
  gender!: 'MALE' | 'FEMALE';

  @Column('varchar', { length: 50, name: 'bank_number', nullable: true })
  bankNumber!: string;

  @Column('varchar', { length: 50, name: 'bank_name', nullable: true })
  bankName!: string;

  @Column('decimal', { nullable: true })
  GPA!: number;

  @Column({ nullable: true })
  description!: string;

  @Column({ name: 'subject_id', nullable: true })
  subjectId!: string;

  @ManyToOne(() => Subject, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;

  @Column({ nullable: true })
  univercity!: string;

  @Column('varchar', { nullable: true, name: 'gpa_or_name_degree' })
  GPAOrNameDegree!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'educational_certification' })
  educationalCertification!: string;

  @Column({ nullable: true, name: 'date_time_learn', type: 'json' })
  dateTimeLearn!: string[];

  @Column({ nullable: true, name: 'video_url' })
  videoUrl!: string;

  @Column({ nullable: true, name: 'teaching_time' })
  teachingTime!: number;

  @Column({ nullable: true, name: 'description_of_subject' })
  descriptionOfSubject!: string;

  @Column({ name: 'is_use_curriculumn', type: 'boolean', default: false })
  isUseCurriculumn!: boolean;

  @Column({ name: 'is_public_profile', type: 'boolean', default: false })
  isPublicProfile!: boolean;

  @Column({ nullable: true, name: 'tutor_level_id' })
  tutorLevelId!: string;

  @OneToMany(() => TutorSubject, (tutorSubject) => tutorSubject.tutor)
  tutorSubjects!: TutorSubject[];

  @ManyToOne(() => TutorLevel, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'tutor_level_id' })
  tutorLevel!: TutorLevel;
}
