import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { Game } from './game.entity';
import { User } from './user.entity';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Review, (review) => review.rate, { onDelete: 'CASCADE' })
  @JoinColumn()
  review: Review;

  @ManyToOne(() => Game, (game) => game.rates)
  game: Game;

  @ManyToOne(() => User, (user) => user.rates)
  user: User;

  @Column()
  score: number;
}
