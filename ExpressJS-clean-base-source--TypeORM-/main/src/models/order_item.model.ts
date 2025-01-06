import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.model';

@Entity('orders_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
  orderId!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ name: 'course_id' })
  courseId!: string;

  @ManyToOne(() => Order, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;
}
