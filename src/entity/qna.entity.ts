import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class Qna {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date;

  //answer인 경우 가리키는 question의 id 저장
  //question인 경우 null
  @Column({ default: null })
  reference: number;

  @Column()
  content: string;

  @Column({ name: 'productId' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.qnas)
  @JoinColumn({ name: 'userId' })
  product: Product;

  @ManyToOne(() => User, (user) => user.qnas)
  user: User;
}
