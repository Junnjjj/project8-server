import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { News } from './news.entity';

@Entity()
export class NewsFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imgURL: string;

  @Column()
  originalName: string;

  @Column()
  fileName: string;

  @Column({ default: false })
  active: boolean;

  @ManyToOne(() => News, (news) => news.newsFiles, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  news: News;
}
