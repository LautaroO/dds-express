import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Municipio } from "./Municipio";

@Entity()
export class Localidad {
    @PrimaryColumn()
    id: string;
    @Column()
    nombre: string;
    @ManyToOne(() => Municipio, (municipio) => municipio.localidades)
    @JoinColumn({ name: "municipio_id", referencedColumnName: "id" })
    municipio: Municipio;
    @Column()
    codPostal: string;
}