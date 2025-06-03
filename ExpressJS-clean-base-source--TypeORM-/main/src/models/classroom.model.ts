import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';
import { TutorProfile } from './tutor_profile.model';
import { BaseModel } from './base.model';
import { UserProfile } from './user_profile.model';
import { ClassroomStatus } from '@/enums/classroom-status.enum';

@Entity('classrooms')
export class Classroom extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'classroom_id' })
  classroomId!: string;

  @Column({ name: 'name_of_room', nullable: true })
  nameOfRoom!: string;

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

  @Column({ name: 'date_time_learn', type: 'json' })
  dateTimeLearn!: string[];

  @Column({ name: 'start_day', type: 'date' })
  startDay!: Date;

  @Column({ name: 'end_day', type: 'date' })
  endDay!: Date;

  @Column({ name: 'classroom_evaluation', type: 'decimal', precision: 2, scale: 1, nullable: true })
  classroomEvaluation!: number;

  @Column({ default: ClassroomStatus.IN_SESSION })
  status!: string;

  @Column({ type: 'boolean', nullable: true, name: 'is_meeted' })
  isMeeted!: boolean;
}
