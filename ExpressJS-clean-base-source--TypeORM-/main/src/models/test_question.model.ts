import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { Test } from './test.model';

@Entity('test_questions')
export class TestQuestion extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'test_question_id' })
  testQuestionId!: string;

  @ManyToOne(() => Test, (test) => test.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test!: Test;

  //question number

  @Column('varchar', { length: 255, name: 'question_text' })
  questionText!: string;

  @Column('varchar', { length: 255, name: 'option_a' })
  optionA!: string;

  @Column('varchar', { length: 255, name: 'option_b' })
  optionB!: string;

  @Column('varchar', { length: 255, name: 'option_c' })
  optionC!: string;

  @Column('varchar', { length: 255, name: 'option_d' })
  optionD!: string;

  @Column('varchar', { length: 1, name: 'correct_answer' })
  correctAnswer!: string; //ko dc tra
}
