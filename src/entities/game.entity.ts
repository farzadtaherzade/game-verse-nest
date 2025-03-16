import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Genre } from './genre.entity';
import { Platform } from './platform.entity';
import { Rate } from './rate.entity';
import { Review } from './review.entity';
import { Company } from './company.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  score: number;

  @Column()
  slug: string;

  @Column()
  release_date: Date;

  @Column({ nullable: true })
  cover: string;

  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];

  @ManyToMany(() => Platform, (p) => p.games)
  @JoinTable()
  platforms: Platform[];

  @ManyToOne(() => User, (user) => user.games)
  user: User;

  @OneToMany(() => Rate, (rate) => rate.game)
  rates: Rate[];

  @OneToMany(() => Review, (review) => review.game)
  reviews: Review[];

  @ManyToOne(() => Company, (company) => company.games)
  company: Company;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
