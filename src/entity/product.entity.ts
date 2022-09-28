import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ProductFile } from './productFile.entity';
import { BiddingLog } from './biddingLog.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
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

  @Column({
    type: 'timestamp',
  })
  endtime: Date;

  @Column({ nullable: true })
  mainUrl: string;

  @Column()
  owner: number;

  @OneToMany(() => ProductFile, (productFile) => productFile.product, {
    cascade: true,
  })
  productFiles: ProductFile[];

  @OneToMany(() => BiddingLog, (biddingLog) => biddingLog.product, {
    cascade: true,
  })
  biddingLogs: BiddingLog[];
}
