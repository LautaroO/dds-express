import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Localidad } from "./Localidad";
import { Provincia } from "./Provincia";

@Entity()
export class Municipio {
    @PrimaryColumn()
    id: string;
    @Column()
    nombre: string;
    @ManyToOne(() => Provincia, (provincia) => provincia.municipios)
    @JoinColumn({ name: "provincia_id", referencedColumnName: "id" })
    provincia: Provincia;
    @OneToMany(() => Localidad, (localidad) => localidad.municipio)
    localidades: Localidad[];
}