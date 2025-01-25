import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Column } from 'typeorm';
import { User } from './user.model';
import { MyCurriculumnItem } from './my-curriculumn-item.model';
import { BaseModel } from './base.model';

@Entity('my_curriculumns')
export class MyCurriculumn extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'my_curriculumn_id' })
  myCurriculumnId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => MyCurriculumnItem, (myCurriculumnItem) => myCurriculumnItem.myCurriculumn, {
    cascade: true,
    eager: true
  })
  items!: MyCurriculumnItem[];
}
