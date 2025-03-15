import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  logo: string;

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
}
