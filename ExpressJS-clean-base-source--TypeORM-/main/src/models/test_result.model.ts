import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { TestQuestion } from './test_question.model';
import { User } from './user.model';

@Entity('test_results')
export class TestResult extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'test_result_id' })
  testResultId!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @OneToOne(() => User, (user) => user.testResults, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('int', { name: 'points' })
  points!: number;

  @Column('timestamp', { name: 'test_date', default: () => 'CURRENT_TIMESTAMP' })
  testDate!: Date;

  @Column('varchar', { length: 255, name: 'title' })
  title!: string;

  @Column('varchar', { length: 255, name: 'description', nullable: true })
  description!: string;

  @OneToMany(() => TestQuestion, (question) => question.test, { cascade: true })
  questions!: TestQuestion[];
}
