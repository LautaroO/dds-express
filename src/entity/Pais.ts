import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Provincia } from "./Provincia";

@Entity()
export class Pais {
    @PrimaryColumn()
    id: string;
    @Column()
    nombre: string;
    @OneToMany(() => Provincia, (provincia) => provincia.pais)
    provincias: Provincia[]
}