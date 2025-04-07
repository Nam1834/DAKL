import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, Column } from 'typeorm';
import { User } from './user.model';
import { BaseModel } from './base.model';
import { MyTutorItem } from './my_tutor_item.model';

@Entity('my_tutors')
export class MyTutor extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'my_tutor_id' })
  myTutorId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => MyTutorItem, (myTutorItem) => myTutorItem.myTutor, {
    cascade: true,
    eager: true
  })
  items!: MyTutorItem[];
}
