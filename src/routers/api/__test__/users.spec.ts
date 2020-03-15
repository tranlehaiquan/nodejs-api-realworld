import request from 'supertest';
import mongoose from 'mongoose';
import { v1 as uuidv1 } from 'uuid';
import app from '../../../index';

function generateRandomEmail() : string {
  return uuidv1() + '@gmail.com';
}

describe('Users api test', () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    mongoose.disconnect();
  });

  it('Register and save user successful', async () => {
    const email = generateRandomEmail();
    const userData = {
      "username": email,
      "password": "12345678",
      "email": email
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(userData);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toEqual(userData.email);
      expect(res.body.data.username).toEqual(userData.username);
      expect(res.body.data.image).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.token).toHaveProperty('token');
      expect(res.body.data.token).toHaveProperty('exp');
  });

  it('Register failed with duplicate user', async () => {
    const email = generateRandomEmail();
    const userData = {
      "username": email,
      "password": "12345678",
      "email": email,
    };
    await request(app)
      .post('/api/users/register')
      .send(userData);
    const res = await request(app)
      .post('/api/users/register')
      .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.statusCode).toBeDefined();
  });

  it('Login successed with vaild user info', async () => {
    const email = generateRandomEmail();
    const userData = {
      "username": email,
      "password": "12345678",
      "email": email,
    };
    await request(app)
      .post('/api/users/register')
      .send(userData);
    const resLogin = await request(app)
      .post('/api/users/login')
      .send({
        username: userData.username,
        password: userData.password,
      });

      expect(resLogin.status).toBe(200);
      expect(resLogin.body.data.email).toEqual(userData.email);
      expect(resLogin.body.data.username).toEqual(userData.username);
      expect(resLogin.body.data.image).toBeDefined();
      expect(resLogin.body.data.id).toBeDefined();
      expect(resLogin.body.data.token).toHaveProperty('token');
      expect(resLogin.body.data.token).toHaveProperty('exp');
  });

  it('Login failed with invaild user info', async () => {
    const resLogin = await request(app)
      .post('/api/users/login')
      .send({
        username: '111111111111',
        password: '111111111111',
      });

      expect(resLogin.status).toBe(401);
      expect(resLogin.body.error).toBeDefined();
      expect(resLogin.body.statusCode).toBeDefined();
  });

  it('Get current user info successed with vaild token', async () => {
    const email = generateRandomEmail();
    const userData = {
      "username": email,
      "password": "12345678",
      "email": email,
    };
    const resRegister = await request(app)
      .post('/api/users/register')
      .send(userData);
    const { token } = resRegister.body.data.token;

    const resGetCurrentUser = await request(app)
      .get('/api/users/')
      .set({
        Authorization: 'Bearer ' + token,
      });
      
      expect(resGetCurrentUser.status).toBe(200);
  });

  it('Get current user info failed with invaild token', async () => {
    const resGetCurrentUser = await request(app)
      .get('/api/users/')
      .set({
        Authorization: 'Bearer ' + '123213',
      });

      expect(resGetCurrentUser.status).toBe(401);
      expect(resGetCurrentUser.body.error).toBeDefined();
      expect(resGetCurrentUser.body.statusCode).toBeDefined();
  });
});
