import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { MyTutor } from './my_tutor.model';
import { TutorProfile } from './tutor_profile.model';

@Entity('my_tutor_items')
export class MyTutorItem extends BaseModel {
  @PrimaryColumn({ name: 'my_tutor_id' })
  myTutorId!: string;

  @PrimaryColumn({ name: 'tutor_id' })
  tutorId!: string;

  @ManyToOne(() => MyTutor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'my_tutor_id' })
  myTutor!: MyTutor;

  @ManyToOne(() => TutorProfile, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor!: TutorProfile;
}
