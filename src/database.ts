import mongoose from 'mongoose';
import './models/User';

export default async (): Promise<void> => {
  const databaseUri = process.env.DATABASE_URI || '';

  try {
    mongoose.set('debug', process.env.NODE_ENV === 'development' && true);
    await mongoose.connect(databaseUri, {
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error('Failed to connect to database ', err); /* eslint-disable-line no-console */
  }
};
