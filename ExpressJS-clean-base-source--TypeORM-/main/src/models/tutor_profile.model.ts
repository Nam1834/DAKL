import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { User } from './user.model';

@Entity('tutor_profiles')
export class TutorProfile extends BaseModel {
  @PrimaryColumn({
    name: 'user_id'
  })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('text', { nullable: true })
  avatar?: string;

  @Column({ name: 'major_name', nullable: true })
  majorName!: string;

  @Column({ name: 'teaching_certification', nullable: true })
  teachingCetification!: string;

  @Column({ nullable: true })
  degree!: string;

  @Column({ nullable: true })
  univercity!: string;

  @Column('decimal', { nullable: true })
  GPA!: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'educational_certification' })
  educationalCertification!: string;

  @Column({ nullable: true, name: 'date_time_learn', type: 'json' })
  dateTimeLearn!: string[];

  @Column({ nullable: true, name: 'teaching_time' })
  teachingTime!: number;

  @Column('int', { nullable: true })
  amount!: number;

  @Column({ nullable: true, name: ' teaching_road_map' })
  teachingRoadMap!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true, name: 'video_url' })
  videoUrl!: string;

  @Column({ nullable: true, name: 'teaching_method' })
  teachingMethod!: string;

  @Column({ nullable: true, name: 'work_address' })
  workAddress!: string;

  @Column({ name: 'is_use_curriculumn', type: 'boolean', default: false })
  isUseCurriculumn!: boolean;
}
