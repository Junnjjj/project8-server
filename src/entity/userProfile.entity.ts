import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  location: string;

  @Column({ length: 15, nullable: true })
  tel: string;

  @Column()
  photoImg: string;

  // + 별점
  @Column({ default: 0 })
  starCount: number;

  // + 재거래 희망률
  @Column({ default: 50 })
  reTransactionRate: number;

  // + 거래횟수 => query 문
  @Column({ default: 0 })
  onSaleProduct: number;

  @Column({ default: 0 })
  biddingProduct: number;
}
