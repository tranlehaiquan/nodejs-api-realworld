// const mongoose = require('mongoose');
// const UserModel = require('../User');
import mongoose from 'mongoose';
import '../../index';
import UserModel from '../User';
import ArticleModel from '../Article';
import FavoriteArticle from '../Favorite';

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

describe('Favorite model test', () => {
  const validUser = new UserModel(userData);
  const validArticle = new ArticleModel({...articleData, author: validUser.id});
  
  // It's just so easy to connect to the MongoDB Memory Server 
  // By using mongoose.connect
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    mongoose.disconnect();
  });

  it('Crete and save favorite successful', async () => {
    const validFavorite = new FavoriteArticle({
      user: validUser.id,
      article: validArticle.id,
    });

    expect(validFavorite.id).toBeDefined();
    expect(validFavorite.user.toString()).toEqual(validUser.id.toString());
    expect(validFavorite.article.toString()).toEqual(validArticle.id.toString());
  });
})
