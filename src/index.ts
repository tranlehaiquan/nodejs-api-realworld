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
const port = process.env.PORT || '3000';

// Load .env config
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
database();

const app = express();
app.use(express.urlencoded());
app.use(express.json());

// logger
if(!isProduction) {
  app.use(morgan('dev'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// define a route handler for the default home page
app.use('/', routers);

// 404 NOT FOUND
app.use((req: Request, res: Response, next: NextFunction) => {
  var err = new ErrorResponse(404, 'Not Found');
  next(err);
});

if(!isProduction) {
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json(error.stack);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(error: ErrorResponse, req: Request, res: Response, next: NextFunction) {
  const { statusCode = 500, message } = error;
  res.status(statusCode).json({
    statusCode,
    message,
  });
});

// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }`);
});
