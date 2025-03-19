import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Rate } from './rate.entity';
import { Review } from './review.entity';
import { Company } from './company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  is_admin: boolean;

  @OneToMany(() => Game, (game) => game.user)
  games: Game[];

  @OneToMany(() => Rate, (rate) => rate.user)
  rates: Rate[];

  @OneToMany(() => Review, (review) => review.platform)
  reviews: Review[];

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];
}
