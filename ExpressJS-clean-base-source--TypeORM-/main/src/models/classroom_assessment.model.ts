import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TutorProfile } from './tutor_profile.model';
import { BaseModel } from './base.model';
import { UserProfile } from './user_profile.model';
import { ClassroomStatus } from '@/enums/classroom-status.enum';
import { Classroom } from './classroom.model';

@Entity('classroom_assessments')
export class ClassroomAssessment extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'classroom_assessment_id' })
  classroomAssessmentId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserProfile;

  @Column({ name: 'tutor_id' })
  tutorId!: string;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;

  @Column({ name: 'classroom_id' })
  classroomId!: string;

  @ManyToOne(() => Classroom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id' })
  classroom!: Classroom;

  @Column({ name: 'classroom_evaluation', type: 'decimal', precision: 2, scale: 1, nullable: true })
  classroomEvaluation!: number;

  @Column({ nullable: true })
  description!: string;
}
