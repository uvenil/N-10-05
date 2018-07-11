require('./../../config/config');

const {ObjectID} = require('mongodb');
var { mongoose } = require('./../../db/mongoose');

const jwt = require('jsonwebtoken');

const { Utxt } = require('./../../models/utxt');
const { Ulink } = require('./../../models/ulink');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'mic@example.com',
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
  text: 'First test ulink',
  'utxtuser._creator': userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test ulink',
  completed: true,
  'time.completedAt': 333,
  'utxtuser._creator': userTwoId
}];

const ulinks = [{
  ...utxts[0],
  _id: new ObjectID(),
  ver: [{ // Verknüpfungstyp
    name: "testlink1",
    utxts: [utxts[0]._id, utxts[1]._id], // utxts in der Verbingung Ulink in der richtigen Reihenfolge
  ulinkcond: [utxts[0]._id] // Bedingung für die Gükltigkeit der Verbindung
  }]
}, {
  ...utxts[1],
  _id: new ObjectID(),
  text: 'Second test utxt',
  completed: true,
  'time.completedAt': 555,
  'utxtuser._creator': userTwoId,
  ver: [{ // Verknüpfungstyp
      name: "testlink2",
      utxts: [utxts[1]._id, utxts[0]._id], // utxts in der Verbingung Ulink in der richtigen Reihenfolge
      ulinkcond: [utxts[1]._id] // Bedingung für die Gükltigkeit der Verbindung
  }]
}];

const done = () => {
  console.log("fertig!");
  };

const populateUtxts = (done) => {
  Utxt.remove({}).then(() => {
    var ut1 = new Utxt(utxts[0]).save();
    var ut2 = new Utxt(utxts[1]).save();

    return Promise.all([ut1, ut2])

    // return Utxt.insertMany(utxts);
  }).then(() => done());
};

const populateUlinks = (done) => {
  Ulink.remove({}).then(() => {
    var ul1 = new Ulink(ulinks[0]).save();
    var ul2 = new Ulink(ulinks[1]).save();

    return Promise.all([ul1, ul2])

    // return Ulink.insertMany(ulinks);
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

populateUsers(done);
populateUlinks(done);
populateUtxts(done);
