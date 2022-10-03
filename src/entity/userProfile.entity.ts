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

  @Column({ default: 0 })
  onSaleProduct: number;

  @Column({ default: 0 })
  biddingProduct: number;
}
