import { Entity, PrimaryColumn, ManyToOne, Column, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { MyCurriculumn } from './my_curriculumn.model';
import { BaseModel } from './base.model';
import { CurriculumnStatus } from '@/enums/curriculumn-status.eum';

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
  description!: string;

  @Column({ default: CurriculumnStatus.UNACTIVE })
  status!: string;

  @Column({ name: 'role_user_created' })
  roleUserCreated!: string;
}
