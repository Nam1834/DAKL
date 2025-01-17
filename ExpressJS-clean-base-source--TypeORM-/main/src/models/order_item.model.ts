import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.model';
import { ValueConfig } from './value_config.model';

@Entity('orders_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
  orderId!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ name: 'value_config_id' })
  valueConfigId!: string;

  @ManyToOne(() => ValueConfig, { onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'value_config_id' })
  valueConfig!: ValueConfig;

  @ManyToOne(() => Order, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;
}
