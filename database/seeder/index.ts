import mongoose from 'mongoose';
import dotenv from 'dotenv';

import seederUsers from './users';

dotenv.config();

(async () => {
  let databaseUri;
  if(process.env.NODE_ENV === 'development') databaseUri = process.env.DATABASE_URI_DEVELOPMENT;
  if(process.env.NODE_ENV === 'test') databaseUri = process.env.DATABASE_URI_TEST;

  try {
    mongoose.set(
      'debug', 
      process.env.NODE_ENV === 'production' && true
    );
    await mongoose.connect(databaseUri, {useNewUrlParser: true});
    await seederUsers();

    console.log('Seed data done');
    process.exit();
  } catch(err) {
    console.error('Failed to connect to database ', err);
  }
})();
