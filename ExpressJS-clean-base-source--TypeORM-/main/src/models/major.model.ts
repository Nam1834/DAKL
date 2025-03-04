import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('majors')
export class Major extends BaseModel {
  @PrimaryColumn({ name: 'major_id' })
  majorId!: string;

  @Column({ name: 'sum_name', nullable: true })
  sumName!: string;

  @Column({ name: 'major_name' })
  majorName!: string;
}
