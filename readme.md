[![Build Status](https://travis-ci.com/tranlehaiquan/nodejs-api-realworld.svg?branch=master)](https://travis-ci.com/tranlehaiquan/nodejs-api-realworld)

I'm gonna code a RestFul with Express, Typescript

REST: Representational State Transfer
API: application programming interface

### Setup

Prerequisites:

- NodeJS 8+
- npm 3

```
$ npm install
```

Env variables in sample file. You can copy and rename it to .env and edit varialbe value with your own value.

### Linting and testing tools

- [x] [Prettylint](https://github.com/ikatyang/prettylint)
- [x] [Eslint](https://eslint.org/)
- [x] [Jest](https://github.com/facebook/jest)

 
Basic mongodb schema: http://learnmongodbthehardway.com/schema/schemabasics

## DATABASE

Reference-style: 
![alt text][database design]

### One to one
### One to many
http://learnmongodbthehardway.com/schema/schemabasics/#one-to-many-1-n

### Many to many

### Database design

### Rest API design
https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9


## Todos

- [x] JWT problems
- [x] Better error handler
- [ ] Support swagger docs
- [ ] Support multiple language
- [ ] Integrate with front end
- [x] Add ci/cd unit test

## Test

- Test runner: Jest, Supertest
- Coverage: `npm run coverage`
- Unit test: `npm run test`

[database design]: ./public/images/realworld-database.jpg "Logo Title Text 2"
