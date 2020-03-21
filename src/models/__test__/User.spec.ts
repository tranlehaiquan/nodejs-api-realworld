// const mongoose = require('mongoose');
// const UserModel = require('../User');
import mongoose from 'mongoose';
import '../../index';
import UserModel from '../User';

const userData = {
  username: 'tran le hai quan',
  email: 'tranlehaiquan@gmail.com',
  password: 'helloTheWorld',
};

describe('User Model Test', () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    mongoose.disconnect();
  });

  it('create & save user successfully', async () => {
    const validUser = new UserModel(userData);
    validUser.setPassword(userData.password);

    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser.id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.validatePassword(userData.password)).toBeTruthy();
  });
});
