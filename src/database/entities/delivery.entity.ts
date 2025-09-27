import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  import { Order } from './order.entity';
  
  export enum DeliveryStatus {
    REQUESTED = 'requested',       // request sent to Uber
    ACCEPTED = 'accepted',         // driver accepted
    PICKUP_ARRIVED = 'pickup_arrived',
    PICKED_UP = 'picked_up',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    FAILED = 'failed',
  }
  
  @Entity('deliveries')
  export class Delivery {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    // Link to our internal order
    @OneToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn()
    order: Order;
  
    // Uber Eats (or external provider) delivery ID
    @Column({ nullable: true })
    external_delivery_id: string;
  
    // Delivery status
    @Column({
      type: 'enum',
      enum: DeliveryStatus,
      default: DeliveryStatus.REQUESTED,
    })
    status: DeliveryStatus;
  
    // Addresses
    @Column({ nullable: true })
    pickup_address: string;
  
    @Column({ nullable: true })
    dropoff_address: string;
  
    // Coordinates (for Uber API)
    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    pickup_lat: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    pickup_lng: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    dropoff_lat: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    dropoff_lng: number;
  
    // Pricing
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    estimated_cost: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    final_cost: number;
  
    // Timestamps
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  }
  