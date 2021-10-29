import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Pictogram } from "./Pictogram";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Pictogram, (pictogram) => pictogram.category)
  pictograms: Pictogram[];
}
