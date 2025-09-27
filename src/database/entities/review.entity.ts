import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Restaurant } from './restraunt.entity';
  
  @Entity('reviews')
  export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'int', width: 1 })
    rating: number; // 1–5 stars
  
    @Column({ nullable: true })
    comment: string;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // Relationships
    @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
    user: User;
  
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews, { onDelete: 'CASCADE' })
    restaurant: Restaurant;
  }
  