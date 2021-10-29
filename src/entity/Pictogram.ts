import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Pictogram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.pictograms)
  category: Category;

  @Column()
  categoryId: number;

  @Column()
  description: string;

  @Column()
  imagePath: string;
}
