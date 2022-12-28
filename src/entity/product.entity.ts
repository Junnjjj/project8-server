import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { ProductFile } from './productFile.entity';
import { BiddingLog } from './biddingLog.entity';
import { User } from './user.entity';
import { ProductFavorite } from './productFavorite.entity';
import { Alarm } from './alarm.entity';
import { Qna } from './qna.entity';

@Entity()
export class Product extends BaseEntity {
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

  @Column({ length: 3000 })
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

  @Column({ name: 'userId' })
  userId: number;

  // product 판매자
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ProductFile, (productFile) => productFile.product, {
    cascade: true,
  })
  productFiles: ProductFile[];

  @OneToMany(() => BiddingLog, (biddingLog) => biddingLog.product, {
    cascade: true,
  })
  biddingLogs: BiddingLog[];

  @OneToMany(
    () => ProductFavorite,
    (productFavorite) => productFavorite.product,
    {
      cascade: true,
    },
  )
  productFavorites: ProductFavorite[];

  @OneToMany(() => Alarm, (alarm) => alarm.product)
  alarms: Alarm[];

  @OneToMany(() => Qna, (qna) => qna.product, {
    cascade: true,
  })
  qnas: Qna[];
}
