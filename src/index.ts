import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import compression from 'compression';
import path from 'path';
import cors from 'cors';

import routers from './routers';

import ErrorResponse from './models/Error/ErrorResponse';
import * as swaggerDocument from './swagger.json';

dotenv.config();
// Load .env config
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || '3000';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());

// logger
if (!isProduction) {
  app.use(morgan('dev'));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.use(express.static(path.resolve(__dirname, '..', './public')));
app.use(cors());

// define a route handler for the default home page
app.use('/', routers);

// 404 NOT FOUND
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorResponse(404, 'Not Found');
  next(err);
});

if (!isProduction) {
  app.use((error: any, req: Request, res: Response) => {
    res.status(error.status || 500);
    res.json(error.stack);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function showClientError(error: ErrorResponse, req: Request, res: Response) {
  const { statusCode = 500, message } = error;
  res.status(statusCode).json({
    statusCode,
    message,
  });
});

if (process.env.NODE_ENV !== 'test') {
  // start the Express server
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`); /* eslint-disable-line no-console */
  });
}

export default app;
