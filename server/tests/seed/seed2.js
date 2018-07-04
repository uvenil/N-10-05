const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

// const {Todo} = require('./../../models/todo');
// const {User} = require('./../../models/user');

const userThreeId = new ObjectID();
const userFourId = new ObjectID();
const users2 = [{
  _id: userThreeId,
  email: 'm1@example.com',
  password: 'userThreePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userThreeId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userFourId,
  email: 'm2@example.com',
  password: 'userFourPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userFourId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

module.exports = {users2};
