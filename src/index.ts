import express, { Request, Response, NextFunction } from 'express';
import routers from './routers';
import dotenv from 'dotenv';
import morgan from 'morgan';
import database from './database';
import path from 'path';

// Load .env config
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
database();

const app = express();
app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || '3000';

// logger
app.use(morgan('dev'));

// define a route handler for the default home page
app.use('/', routers);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  res.send('Not found!');
});

// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }`);
});
