import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('value_configs')
export class ValueConfig extends BaseModel {
  @PrimaryColumn({ name: 'value-config_id' })
  valueConfigId!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ name: 'coin_config' })
  coinConfig!: number;

  @Column({ name: ' url_config' })
  urlConfig!: string;

  @Column()
  description!: string;
}
