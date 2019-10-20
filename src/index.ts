import express, { Request, Response, NextFunction } from 'express';
import routers from './routers';
import dotenv from 'dotenv';
import morgan from 'morgan';
import database from './database';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { ErrorResponse } from './models/Error';
import * as swaggerDocument from '../swagger.json';

const isProduction = process.env.NODE_ENV === 'production';

// Load .env config
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
database();

const app = express();
app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || '3000';

// logger
if(!isProduction) {
  app.use(morgan('dev'));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// define a route handler for the default home page
app.use('/', routers);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  res.send('Not found!');
});

app.use((req: Request, res: Response, next: NextFunction) => {
  var err = new ErrorResponse('Not Found');
  err.status = 404;
  next(err);
});

if(!isProduction)
app.use((error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500);

  res.json(error);
});

// production error handler
// no stacktraces leaked to user
app.use(function(error: ErrorResponse, req: Request, res: Response, next: NextFunction) {
  res.status(error.status || 500);
  res.json(error);
});

// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }`);
});
