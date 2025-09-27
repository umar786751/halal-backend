import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { Restaurant } from './restraunt.entity';
  
  export enum DealType {
    PERCENTAGE = 'percentage', // e.g. 20% OFF
    FIXED = 'fixed',           // e.g. $5 OFF
    BOGO = 'bogo',             // Buy One Get One
  }
  
  @Entity('deals')
  export class Deal {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    title: string;
  
    @Column({ type: 'enum', enum: DealType })
    type: DealType;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    discount_value: number;
  
    @Column({ type: 'timestamp', nullable: true })
    start_date: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    end_date: Date;
  
    @Column({ default: true })
    is_active: boolean;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // Relationship
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.deals, { onDelete: 'CASCADE' })
    restaurant: Restaurant;
  }
  