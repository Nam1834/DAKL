import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel {
  @CreateDateColumn({ name: 'create_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt!: Date;

  @Column({ nullable: true, name: 'create_by' })
  createdBy!: string;

  @Column({ nullable: true, name: 'update_by' })
  updatedBy!: string;

  @Column({ nullable: true, name: 'delete_at' })
  deletedAt!: Date;
}
