import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { TestQuestion } from './test_question.model';

@Entity('tests')
export class Test extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'test_id' })
  testId!: string;

  @Column('varchar', { length: 255, name: 'tittle' })
  tittle!: string;

  @Column('varchar', { length: 255, name: 'description', nullable: true })
  description!: string;

  @OneToMany(() => TestQuestion, (question) => question.test, { cascade: true })
  questions!: TestQuestion[];
}
