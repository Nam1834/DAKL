import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { User } from './user.model';
import { TutorSubject } from './tutor_subject.model';
import { TutorLevel } from './tutor_level.model';
import { Major } from './major.model';
import { Subject } from './subject.model';
import { TeachingMethod } from '@/enums/teaching-method.enum';
import { TutorRequestStatus } from '@/enums/tutor_request_status.enum';

@Entity('tutor_requests')
export class TutorRequest extends BaseModel {
  @PrimaryColumn({ name: 'tutor_request_id' })
  tutorRequestId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('text', { nullable: true })
  avatar!: string;

  @Column('varchar', { length: 100, nullable: true })
  fullname!: string;

  @Column('date', { nullable: true })
  birthday!: Date;

  @Column({ type: 'enum', enum: ['MALE', 'FEMALE'], nullable: true })
  gender!: 'MALE' | 'FEMALE';

  @Column({ nullable: true })
  univercity!: string;

  @Column({ nullable: true, name: 'major_id' })
  majorId!: string;

  @ManyToOne(() => Major, { eager: true })
  @JoinColumn({ name: 'major_id' })
  major!: Major;

  @Column({ name: 'subject_id', nullable: true })
  subjectId!: string;

  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject!: Subject;

  @Column({ nullable: true, name: 'evidence_of_subject' })
  evidenceOfSubject!: string;

  @Column({ nullable: true, name: 'description_of_subject' })
  descriptionOfSubject!: string;

  @Column({ name: 'subject_id_2', nullable: true })
  subjectId2!: string;

  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'subject_id_2' })
  subject2!: Subject;

  @Column({ nullable: true, name: 'evidence_of_subject_2' })
  evidenceOfSubject2!: string;

  @Column({ nullable: true, name: 'description_of_subject_2' })
  descriptionOfSubject2!: string;

  @Column({ name: 'subject_id_3', nullable: true })
  subjectId3!: string;

  @ManyToOne(() => Subject, { eager: true })
  @JoinColumn({ name: 'subject_id_3' })
  subject3!: Subject;

  @Column({ nullable: true, name: 'evidence_of_subject_3' })
  evidenceOfSubject3!: string;

  @Column({ nullable: true, name: 'description_of_subject_3' })
  descriptionOfSubject3!: string;

  @Column('decimal', { nullable: true })
  GPA!: number;

  @Column({ nullable: true, name: 'evidence_of_gpa' })
  evidenceOfGPA!: string;

  @Column({ nullable: true })
  description!: string;

  @Column('varchar', { length: 50, name: 'bank_number', nullable: true })
  bankNumber!: string;

  @Column('varchar', { length: 50, name: 'bank_name', nullable: true })
  bankName!: string;

  @Column({ nullable: true, name: 'date_time_learn', type: 'json' })
  dateTimeLearn!: string[];

  @Column({ nullable: true, name: 'teaching_time', type: 'decimal', precision: 4, scale: 2 })
  teachingTime!: number;

  @Column({ name: 'teaching_method', nullable: true })
  teachingMethod!: string;

  @Column({ nullable: true, name: 'teaching_place' })
  teachingPlace!: string;

  @Column({ nullable: true, name: 'video_url' })
  videoUrl!: string;

  @Column({ name: 'is_use_curriculumn', type: 'boolean' })
  isUseCurriculumn!: boolean;

  @Column({ nullable: true, name: 'tutor_level_id' })
  tutorLevelId!: string;

  @Column({ nullable: true, name: 'tutor_level_solved_id' })
  tutorLevelSolvedId!: string;

  @OneToMany(() => TutorSubject, (tutorSubject) => tutorSubject.tutor)
  tutorSubjects!: TutorSubject[];

  @ManyToOne(() => TutorLevel, { eager: true })
  @JoinColumn({ name: 'tutor_level_id' })
  tutorLevel!: TutorLevel;

  @ManyToOne(() => TutorLevel, { eager: true })
  @JoinColumn({ name: 'tutor_level_solved_id' })
  tutorLevelSolved!: TutorLevel;

  @Column({ nullable: true })
  type!: string;

  @Column({ default: TutorRequestStatus.REQUEST })
  status!: string;

  @Column({ name: 'total_test_points', type: 'int', nullable: true })
  totalTestPoints!: number;
}
