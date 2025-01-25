import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { MyCurriculumn } from './my-curriculumn.model';
import { Curriculumn } from './curriculumn.model';
import { BaseModel } from './base.model';

@Entity('my_curriculumn_items')
export class MyCurriculumnItem extends BaseModel {
  @PrimaryColumn({ name: 'my_curriculumn_id' })
  myCurriculumnId!: string;

  @PrimaryColumn({ name: 'curriculumn_id' })
  curriculumnId!: string;

  @ManyToOne(() => MyCurriculumn, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'my_curriculumn_id' })
  myCurriculumn!: MyCurriculumn;

  @ManyToOne(() => Curriculumn, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'curriculumn_id' })
  curriculumn!: Curriculumn;
}
