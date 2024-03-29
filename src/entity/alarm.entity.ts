import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Alarm extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint' })
  type: number;

  @Column({ default: false })
  readAlarm: boolean;

  @Column({ name: 'productId' })
  productId: number;

  @DeleteDateColumn()
  deleteAt: Date;

  @Column({ name: 'userId' })
  @Index()
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.alarms)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.alarms)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
