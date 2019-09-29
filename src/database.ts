import mongoose from 'mongoose';
import './models/User';

export default async () => {
  const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/realworld-be';

  try {
    mongoose.set('debug', true);
    await mongoose.connect(databaseUri, {useNewUrlParser: true});
    console.log('Success connect to db');

  } catch(err) {
    console.error('Failed to connect to database ', err);
  }
}