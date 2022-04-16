import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Municipio } from "./Municipio";
import { Pais } from "./Pais";

@Entity()
export class Provincia {
    @PrimaryColumn()
    id: string;
    @Column()
    nombre: string;
    @ManyToOne(() => Pais, (pais) => pais.provincias)
    @JoinColumn({ name: "pais_id", referencedColumnName: "id" })
    pais: Pais;
    @OneToMany(() => Municipio, (municipio) => municipio.provincia)
    municipios: Municipio[];
}