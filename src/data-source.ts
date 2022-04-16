import "reflect-metadata"
import { DataSource } from "typeorm"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 33060,
    username: "root",
    password: "secret",
    database: "geodds",
    logging: false,
    entities: ["dist/entity/*.js"],
    migrations: [],
    subscribers: []
})
