const emptyUserDetailsSet = {};

const completeUserDetailsSet = {
  email: 'testemail@gmail.com',
  userName: 'helloUser',
  firstName: 'Sam',
  lastName: 'Depp',
  password: 'myPassword&5'
};

const userDetailsSet_withEmail = {
  email: 'testemail@gmail.com',
  firstName: 'Sam',
  lastName: 'Depp',
  password: 'myPassword&5'
};

const userDetailsSet_withUserName = {
  userName: 'helloUser',
  firstName: 'Sam',
  lastName: 'Depp',
  password: 'myPassword&5'
};

module.exports = {
  emptyUserDetailsSet,

  completeUserDetailsSet,

  userDetailsSet_withEmail,

  userDetailsSet_withUserName,
};