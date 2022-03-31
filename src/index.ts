import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World from express!');
});

app.listen(port, () => {
    console.log(`[Server]: Server is running at https://localhost:${port}`);
});