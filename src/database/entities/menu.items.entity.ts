import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { Restaurant } from './restraunt.entity';
  import { OrderItem } from './order.items.entity';
  
  @Entity('menu_items')
  export class MenuItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    caution: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    item_type: string;

    @Column({ nullable: true })
    tax: number;
  
    @Column({ nullable: true })
    image: string;
  
    @Column({ nullable: true, length: 50 })
    category: string; // e.g. "Pizza", "Burgers", "Drinks"
  
    @Column({ default: true })
    is_available: boolean;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // Relationships
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu_items, { onDelete: 'CASCADE' })
    restaurant: Restaurant;
  }
  