import express from 'express';
import index from './routers';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectToClientDB } from './database';
import path from 'path';

// Load .env config
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
connectToClientDB();

const app = express();
const port = process.env.PORT || '3000';

// logger
app.use(morgan('dev'));

// define a route handler for the default home page
app.use('/', index);

// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }`);
});
