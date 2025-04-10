import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MyCurriculumn } from './my_curriculumn.model';
import { BaseModel } from './base.model';
import { CurriculumnStatus } from '@/enums/curriculumn-status.eum';
import { Major } from './major.model';
import { Subject } from './subject.model';

@Entity('curriculumns')
export class Curriculumn extends BaseModel {
  @PrimaryColumn({ name: 'curriculumn_id' })
  curriculumnId!: string;

  @Column({ name: 'curriculumn_name' })
  curriculumnName!: string;

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

  @Column({ name: 'curriculumn_url' })
  curriculumnUrl!: string;

  @Column()
  description!: string;

  @Column({ default: CurriculumnStatus.UNACTIVE })
  status!: string;

  @Column({ name: 'role_user_created' })
  roleUserCreated!: string;
}
