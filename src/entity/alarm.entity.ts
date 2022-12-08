import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint' })
  type: number;

  @Column({ default: false })
  readAlarm: boolean;

  @Column({ name: 'productId' })
  productId: string;

  @Column({ name: 'userId' })
  @Index()
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.alarms)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.alarms)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
