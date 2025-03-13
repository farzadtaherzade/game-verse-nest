import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Platform } from './platform.entity';
import { Rate } from './rate.entity';
import { User } from './user.entity';
import { Game } from './game.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  create_at: Date;

  @ManyToOne(() => Platform, (platform) => platform.reviews)
  platform: Platform;

  @ManyToOne(() => Game, (game) => game.reviews)
  game: Game;

  @OneToOne(() => Rate, (rate) => rate.review, {
    cascade: true,
  })
  rate: Rate;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column()
  view: number;
}
