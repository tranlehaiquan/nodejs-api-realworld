import mongoose from 'mongoose';
import '../../index';
import UserModel from '../User';
import ArticleModel from '../Article';

const userData = {
  username: 'tran le hai quan',
  email: 'tranlehaiquan@gmail.com',
  password: 'helloTheWorld',
};

const articleData = {
  title: 'hello the world',
  description: "i'm thinking, please don't call.",
  body: "i'm thinking, please don't call. My name is Quan. I am from Hoi An. Today is hot day.",
  tagList: ['blog', 'new'],
};

describe('Article model test', () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    mongoose.disconnect();
  });

  it('Create and save article successful', async () => {
    const validUser = new UserModel(userData);

    const vaildArticle = new ArticleModel({
      ...articleData,
      author: validUser.id,
    });
    const saveArticle = await vaildArticle.save();

    expect(saveArticle.id).toBeDefined();
    expect(saveArticle.slug).toBeDefined();
    expect(saveArticle.description).toBe(articleData.description);
    expect(saveArticle.body).toBe(articleData.body);
    expect(saveArticle.tagList.length).toBe(articleData.tagList.length);
    expect(saveArticle.author.toString()).toEqual(validUser.id.toString());
  });
});
