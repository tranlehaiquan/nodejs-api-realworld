import request from 'supertest';
import mongoose from 'mongoose';
import faker from 'faker';
import app from '../../../index';

describe('Articles api test', () => {
  let userToken = '';

  beforeAll(async () => {
    const email = faker.internet.email();
    const userData = {
      "username": email,
      "password": faker.internet.password(),
      "email": email,
    };

    const registerRequest = await request(app)
      .post('/api/users/register')
      .send(userData);

    userToken = registerRequest.body.data.token.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    mongoose.disconnect();
  });

  it('Create article and save successful with vaild input', async () => {
    const articleData = {
      "title": faker.lorem.words(4),
      "description": faker.lorem.words(10),
      "body": faker.lorem.paragraphs(2),
      "tagList": ["vuejs"]
    };

    const createArticleRequest = await request(app)
    .post('/api/articles')
    .send(articleData)
    .set({
      Authorization: 'Bearer ' + userToken,
    });

    expect(createArticleRequest.status).toBe(200);
    expect(createArticleRequest.body.data.title).toBe(articleData.title);
    expect(createArticleRequest.body.data.description).toBe(articleData.description);
    expect(createArticleRequest.body.data.body).toBe(articleData.body);
    expect(createArticleRequest.body.data.tagList.length).toBe(articleData.tagList.length);
  });

  it('Create article and save failed without token', async () => {
    const articleData = {
      "title": faker.lorem.words(10),
      "description": faker.lorem.words(3),
      "body": faker.lorem.paragraphs(2),
      "tagList": [faker.lorem.words(2).split(' ')],
    };
    const createArticleRequest = await request(app)
    .post('/api/articles')
    .send(articleData);

    expect(createArticleRequest.status).toBe(401);
  });

  it('Get articles successful', async () => {
    const articleData = {
      "title": faker.lorem.words(10),
      "description": faker.lorem.words(3),
      "body": faker.lorem.paragraphs(2),
      "tagList": [faker.lorem.words(2).split(' ')],
    };
    await request(app)
    .post('/api/articles')
    .send(articleData);

    const getArticlesRequest = await request(app)
    .get('/api/articles');

    expect(getArticlesRequest.status).toBe(200);
    expect(getArticlesRequest.body.data.articles.length).toBeGreaterThan(0);
  });
});
