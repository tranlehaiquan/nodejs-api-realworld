import faker from 'faker';

import UserModel from '../../src/models/User';

export default async () => {
  const numberOfDocument = 10;
  const listUserSaved = [];
  try {
    for(let x = 0; x < numberOfDocument; x++) {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
  
      const newUser = new UserModel(userData);
      newUser.setPassword(userData.password);
  
      newUser.save();
      console.log(userData);
    }
    console.log('Successful seed data user');
  } catch (err) {
    console.log(err);
    console.log('Failed seed data user');
  }
}
