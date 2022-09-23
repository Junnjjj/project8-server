import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductFile } from './productFile.entity';
import { BiddingLog } from './biddingLog.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  etype: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startprice: string;

  @Column()
  nowPrice: string;

  @Column()
  endtime: string;

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
