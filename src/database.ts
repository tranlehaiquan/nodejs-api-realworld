import mongoose from 'mongoose';
import './models/User';

export default async (): Promise<void> => {
  let databaseUri;
  if (process.env.NODE_ENV === 'production') databaseUri = process.env.DATABASE_URI_PRODUCTION;
  if (process.env.NODE_ENV === 'development') databaseUri = process.env.DATABASE_URI_DEVELOPMENT;
  if (process.env.NODE_ENV === 'test') databaseUri = process.env.DATABASE_URI_TEST;

  try {
    mongoose.set('debug', process.env.NODE_ENV === 'development' && true);
    await mongoose.connect(databaseUri, { useNewUrlParser: true });
  } catch (err) {
    console.error('Failed to connect to database ', err); /* eslint-disable-line no-console */
  }
};
