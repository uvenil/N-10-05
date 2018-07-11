const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Utxt} = require('./../../models/utxt');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const utxts = [{
  _id: new ObjectID(),
  text: 'First test utxt',
  'utxtuser._creator': userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test utxt',
  completed: true,
  'time.completedAt': 333,
  'utxtuser._creator': userTwoId
}];

const populateUtxts = (done) => {
  Utxt.remove({}).then(() => {
    return Utxt.insertMany(utxts);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {utxts, populateUtxts, users, populateUsers};
