import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 33060,
    username: process.env.DBUSER!,
    password: process.env.DBPASS!,
    database: "geodds",
    logging: false,
    entities: ["dist/entity/*.js"],
    migrations: [],
    subscribers: []
})
