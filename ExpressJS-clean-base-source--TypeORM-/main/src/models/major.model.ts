import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { Subject } from './subject.model';

@Entity('majors')
export class Major extends BaseModel {
  @PrimaryColumn({ name: 'major_id' })
  majorId!: string;

  @Column({ name: 'sum_name', nullable: true })
  sumName!: string;

  @Column({ name: 'major_name' })
  majorName!: string;

  @OneToMany(() => Subject, (subject) => subject.major)
  subjects!: Subject[];
}
