// File: app.mjs
import faker from '/faker';

import sortBy from 'lodash/sortBy';

const createFakeUser = () => {
  const name = faker.name.findName();
  const email = faker.internet.email();
  const phoneNumber = faker.phone.phoneNumber();

  return { name, email, phoneNumber };
}

const fakeUsers = [];
for (let i = 0; i < 10; i++) {
  fakeUsers.push(createFakeUser());
}
console.log('fake users');
console.log(fakeUsers);

const sortedFakeUsers = sortBy(fakeUsers, 'name');

console.log('sorted fake users');
console.log(sortedFakeUsers);
