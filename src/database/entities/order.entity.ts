import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm'; 
  import { User } from './user.entity';
  import { Restaurant } from './restraunt.entity';
  import { OrderItem } from './order.items.entity';
  
  export enum OrderStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    PREPARING = 'preparing',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
  }
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;
  
    @Column({ nullable: true })
    delivery_address: string;
  
    @Column({ type: 'varchar', length: 20, default: 'cash' })
    payment_method: 'cash' | 'card' | 'wallet';
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // Relationships
    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    user: User; // customer who placed the order
  
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, { onDelete: 'CASCADE' })
    restaurant: Restaurant;
  
    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];
  }
  