import mongoose from 'mongoose';
import dotenv from 'dotenv';

import seederUsers from './users';

dotenv.config();

(async () => {
  let databaseUri = process.env.DATABASE_URI || '';

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
