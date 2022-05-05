import { AppDataSource } from "./data-source"
import express, { Express, json } from 'express';
import { routes } from "./routes";

AppDataSource.initialize().then(async () => {
    const app: Express = express();
    const port = process.env.PORT;

    //middleware
    app.use(json());
    app.use('/api', routes);

    //server
    app.listen(port, () => {
        console.log(`[Server]: Server is running at http://localhost:${port}`);
    });

}).catch(error => console.log(error));
