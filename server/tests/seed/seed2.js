require('./../../config/config');

const {ObjectID} = require('mongodb');
var { mongoose } = require('./../../db/mongoose');

const jwt = require('jsonwebtoken');

const { Wort } = require('./../../models/wort');
const { Satz } = require('./../../models/satz');
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

const worte = [{
  _id: new ObjectID(),
  text: 'First test satz',
  'wortuser._creator': userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test satz',
  archived: true,
  'time.archivedAt': 333,
  'wortuser._creator': userTwoId
}];

const saetze = [{
  ...worte[0],
  _id: new ObjectID(),
  satz: [{ // Verknüpfungstyp
    name: "testsatz1",
    worte: [worte[0]._id, worte[1]._id], // worte in der Verbingung Satz in der richtigen Reihenfolge
    satzcond: [worte[0]._id] // Bedingung für die Gükltigkeit der Verbindung
  }]
}, {
  ...worte[1],
  _id: new ObjectID(),
  text: 'Second test wort',
  archived: true,
  'time.archivedAt': 555,
  'wortuser._creator': userTwoId,
  satz: [{ // Verknüpfungstyp
      name: "testsatz2",
      worte: [worte[1]._id, worte[0]._id], // worte in der Verbingung Satz in der richtigen Reihenfolge
      satzcond: [worte[1]._id] // Bedingung für die Gükltigkeit der Verbindung
  }]
}];

const done = () => {
  console.log("fertig!");
  };

const populateWorte = (done) => {
  Wort.remove({}).then(() => {
    var ut1 = new Wort(worte[0]).save();
    var ut2 = new Wort(worte[1]).save();

    return Promise.all([ut1, ut2])

    // return Wort.insertMany(worte);
  }).then(() => done());
};

const populateSaetze = (done) => {
  Satz.remove({}).then(() => {
    var ul1 = new Satz(saetze[0]).save();
    var ul2 = new Satz(saetze[1]).save();

    return Promise.all([ul1, ul2])

    // return Satz.insertMany(saetze);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {worte, populateWorte, users, populateUsers};

populateUsers(done);
populateSaetze(done);
populateWorte(done);
