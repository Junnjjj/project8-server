import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductFile } from './productFile.entity';
import { BiddingLog } from './biddingLog.entity';
import { User } from './user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
  })
  createdDate: Date;

  @Column()
  eType: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startPrice: string;

  @Column()
  bidUnit: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  nowPrice: string;

  @Column()
  endHour: string;

  @Column({
    type: 'timestamp',
  })
  endTime: Date;

  @Column({ nullable: true })
  mainUrl: string;

  // 입찰에 성공한 구매자
  @Column({ nullable: true })
  owner: number;

  // product 판매자
  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @OneToMany(() => ProductFile, (productFile) => productFile.product, {
    cascade: true,
  })
  productFiles: ProductFile[];

  @OneToMany(() => BiddingLog, (biddingLog) => biddingLog.product, {
    cascade: true,
  })
  biddingLogs: BiddingLog[];
}
