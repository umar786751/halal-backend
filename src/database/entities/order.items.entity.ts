import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm';
  import { Order } from './order.entity';
  import { MenuItem } from './menu.items.entity';
  
  @Entity('order_items')
  export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    quantity: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number; // price per unit at order time
  
    // Relationships
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;
  
    @ManyToOne(() => MenuItem, { eager: true, onDelete: 'CASCADE' })
    menu_item: MenuItem;
  }
  