import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Game } from './game.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ length: 250, nullable: true })
  about: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Company, (company) => company.children)
  @JoinColumn({ name: 'parentId' })
  parent: Company;

  @OneToMany(() => Company, (company) => company.parent)
  children: Company[];

  @ManyToOne(() => User, (user) => user.companies)
  user: User;

  @OneToMany(() => Game, (game) => game.company)
  games: Game[];
}
