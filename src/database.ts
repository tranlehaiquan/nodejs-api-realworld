import mongodb from 'mongodb';

const { MongoClient } = mongodb;

export const connectToClientDB = async () => {
  const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/realworld-be';
  
  MongoClient.connect(databaseUri, {useNewUrlParser: true}, (error, client) => {
    if(error) {
      console.error(error);

      return Promise.reject(new Error(error.message));
    }

    console.log('Success connect to Datbase');
    return client;
  });
}