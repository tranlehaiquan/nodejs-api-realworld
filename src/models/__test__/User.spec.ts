// const mongoose = require('mongoose');
// const UserModel = require('../User');
import mongoose from 'mongoose';
import UserModel from '../User';

const userData = {
  username: 'tran le hai quan',
  email: 'tranlehaiquan@gmail.com',
  password: 'helloTheWorld',
};

describe('User Model Test', () => {
  // It's just so easy to connect to the MongoDB Memory Server 
  // By using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true
    }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  afterAll(async () => {
    mongoose.disconnect();
  });

  it('create & save user successfully', async () => {
    const validUser = new UserModel(userData);
    validUser.setPassword(userData.password);

    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.validatePassword(userData.password)).toBeTruthy();
  });
})