import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";

@Entity()
export class Pictogram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;

  @Column()
  categoryId: number;

  @Column()
  description: string;
}
