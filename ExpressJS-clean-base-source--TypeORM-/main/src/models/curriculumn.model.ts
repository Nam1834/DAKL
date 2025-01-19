import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MyCurriculumn } from './my-curriculumn.model';
import { BaseModel } from './base.model';

@Entity('curriculumns')
export class Curriculumn extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'curriculumn_id' })
  curriculumnId!: string;

  @Column({ name: 'curriculumn_name' })
  curriculumnName!: string;

  @Column({ name: 'curriculumn_major' })
  curriculumnMajor!: string;

  @Column({ name: 'curriculumn_url' })
  curriculumnUrl!: string;

  @Column()
  desciption!: string;

  @Column()
  status!: string;

  @Column({ name: 'role_user_created' })
  roleUserCreated!: string;
}
