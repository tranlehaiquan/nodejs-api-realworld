<!-- View Source Button --><a href="https://glitch.com/edit/#!/tranlehaiquan-nodejs-api-realworld">  <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fview-source%402x.png?1513093958802" alt="view source" height="33"></a>
I'm gonna code a RestFul with Express, Typescript

REST: Representational State Transfer
API: application programming interface
 
Basic mongodb schema: http://learnmongodbthehardway.com/schema/schemabasics

## One to one
## One to many
http://learnmongodbthehardway.com/schema/schemabasics/#one-to-many-1-n
## Many to many

## Database design

### Follow Profile

- Many to many
- Embedding in User modal

```JSON
{
  "followList": [
    {
      "id": "123222",
      "username": "tranlehaiquan"
    },
    {
      "id": "12221222",
      "username": "tranlehaiquan11"
    }
  ]
}
```

The reason I import `username` inside `followList` because when query get followList we don't need another operation to get `username` from user's `id`. For current `username` can't be change. And I embedding follow because for current we don't need pagination and number of follow user will less than thousand.

### Favorite article

- One to many
- Linking

```JSON
[
  {
    "article_id": "123",
    "username": "tranlehaiquan@gmail.com",
    "created_on": "ISODate(\"2014-01-01T11:01:22Z\")",
    "updated_on": "ISODate(\"2014-01-01T11:01:22Z\")",
    "comment": "Hello the world 123"
  },
  {
    "article_id": "123",
    "username": "tranlehaiquan@gmail.com",
    "created_on": "ISODate(\"2014-01-01T11:01:22Z\")",
    "updated_on": "ISODate(\"2014-01-01T11:01:22Z\")",
    "comment": "Hello the world 456"
  }
]
```

### Comment artcile

## Rest API design

https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9
