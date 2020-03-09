// const mongoose = require('mongoose');
// const UserModel = require('../User');
import mongoose from 'mongoose';
import UserModel from '../User';
import ArticleModel from '../Article';
import CommentModel from '../Comment';

const userData = {
  username: 'tran le hai quan',
  email: 'tranlehaiquan@gmail.com',
  password: 'helloTheWorld',
};

const articleData = {
  title: 'hello the world',
  description: 'i\'m thinking, please don\'t call.',
  body: 'i\'m thinking, please don\'t call. My name is Quan. I am from Hoi An. Today is hot day.',
  tagList: ['blog', 'new'],
};

const commentData = {
  comment: 'this is comment description. I dont know why this property name is comment : )). That\' stupid name : )).',
};

describe('Article model test', () => {
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

  it('Crete and save comment successful', async () => {
    const validUser = new UserModel(userData);
    const vaildComment = new CommentModel({
      ...commentData,
      username: validUser.username,
    });
    const saveComment = await vaildComment.save();

    expect(saveComment.id).toBeDefined();
    expect(saveComment.username).toBe(validUser.username);
    expect(saveComment.comment).toBe(commentData.comment);
    expect(saveComment.createdAt).toBeDefined();
    expect(saveComment.updatedAt).toBeDefined();
  });

  it('Create and save comment in article successful', async () => {
    const validUser = new UserModel(userData);

    const vaildArticle = new ArticleModel({
      ...articleData,
      author: validUser.username,
    });
    const vaildComment = new CommentModel({
      ...commentData,
      username: validUser.username,
      article_id: vaildArticle.id,
    });
    const saveComment = await vaildComment.save();

    expect(saveComment.id).toBeDefined();
    expect(saveComment.username).toBe(validUser.username);
    expect(saveComment.article_id.toString()).toEqual(vaildArticle.id.toString());
    expect(saveComment.comment).toBe(commentData.comment);
    expect(saveComment.createdAt).toBeDefined();
    expect(saveComment.updatedAt).toBeDefined();
  });
})