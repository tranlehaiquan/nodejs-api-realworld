import mongoose from 'mongoose';
import './models/User';

export default async () => {
  let databaseUri;
  if(process.env.NODE_ENV === 'production') databaseUri = process.env.DATABASE_URI_PRODUCTION;
  if(process.env.NODE_ENV === 'development') databaseUri = process.env.DATABASE_URI_DEVELOPMENT;
  if(process.env.NODE_ENV === 'test') databaseUri = process.env.DATABASE_URI_TEST;

  try {
    mongoose.set('debug', true);
    await mongoose.connect(databaseUri, {useNewUrlParser: true});
    console.log('Success connect to db');

  } catch(err) {
    console.error('Failed to connect to database ', err);
  }
}