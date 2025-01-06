import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseModel } from './base.model';
import { Payment } from './payment.model';
import { OrderItem } from './order_item.model';
import { User } from './user.model';
import { OrderStatus } from '@/enums/order-status.enum';

@Entity('orders')
export class Order extends BaseModel {
  @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
  orderId!: string;

  @Column({ type: 'decimal', name: 'total_price' })
  totalPrice!: number;

  @Column({ name: 'payment_id', nullable: true })
  paymentId?: string;

  @OneToOne(() => Payment, { nullable: true, onDelete: 'SET NULL', cascade: true })
  @JoinColumn({ name: 'payment_id' })
  payment!: Payment;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items!: OrderItem[];

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'status', type: 'enum', enum: OrderStatus, default: OrderStatus.WAITING_FOR_PAYMENT })
  status!: string;

  @Column({ name: 'customer_fullname', nullable: true })
  customerFullname?: string;

  @Column({ name: 'customer_email', nullable: true })
  customerEmail?: string;

  @Column({ name: 'customer_phone', nullable: true })
  customerPhone?: string;
}
