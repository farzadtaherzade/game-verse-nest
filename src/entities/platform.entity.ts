import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Review } from './review.entity';

@Entity('platforms')
export class Platform {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false, unique: true })
  name: string;

  @Index()
  @Column({ nullable: false })
  shortcut: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @Column({ nullable: true })
  released: Date;

  @ManyToMany(() => Game, (game) => game.platforms)
  games: Game[];

  @OneToMany(() => Review, (review) => review.platform)
  reviews: Review[];
}
