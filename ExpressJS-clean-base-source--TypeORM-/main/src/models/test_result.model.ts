import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { TestQuestion } from './test_question.model';

@Entity('tests')
export class TestResult extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'test_result_id' })
  testResultId!: string;

  //userId
  //points
  //date
  //

  @Column('varchar', { length: 255, name: 'title' })
  title!: string;

  @Column('varchar', { length: 255, name: 'description', nullable: true })
  description!: string;

  @OneToMany(() => TestQuestion, (question) => question.test, { cascade: true })
  questions!: TestQuestion[];
}
