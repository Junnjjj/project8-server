import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAuthority } from './userAuthority.entity';
import { NewsFile } from './newsFile.entity';
import { NewsComment } from './newsComment.entity';
import { NewsFavorite } from './NewsFavorite.entity';

@Entity()
export class News extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createDate: Date;

  @Column()
  title: string;

  @Column()
  subTitle: string;

  @Column({ length: 2000 })
  description: string;

  @Column()
  openDate: string;

  @Column()
  price: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ name: 'authorityId' })
  authorityId: number;

  // news 작성자(Authority)
  @ManyToOne(() => UserAuthority, (userAuthority) => userAuthority.news)
  @JoinColumn({ name: 'authorityId' })
  userAuthority: UserAuthority;

  @OneToMany(() => NewsFile, (newsFile) => newsFile.news, {
    cascade: true,
  })
  newsFiles: NewsFile[];

  @OneToMany(() => NewsComment, (newsComment) => newsComment.news)
  newsComments: NewsComment[];

  @OneToMany(() => NewsFavorite, (newsFavorite) => newsFavorite.news)
  newsFavorites: NewsFavorite[];
}
