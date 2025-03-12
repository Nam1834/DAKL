import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { Major } from './major.model';
import { TutorSubject } from './tutor_subject.model';

@Entity('subjects')
export class Subject extends BaseModel {
  @PrimaryColumn({ name: 'subject_id' })
  subjectId!: string;

  @Column({ name: 'subject_name' })
  subjectName!: string;

  @Column({ name: 'major_id' })
  majorId!: string;

  @ManyToOne(() => Major, { eager: true })
  @JoinColumn({ name: 'major_id' })
  major!: Major;

  @OneToMany(() => TutorSubject, (tutorSubject) => tutorSubject.subject)
  tutorSubjects!: TutorSubject[];
}
