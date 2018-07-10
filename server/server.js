require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Utxt} = require('./models/utxt');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/utxts', authenticate, (req, res) => {
  const aktTime = new Date().getTime();
  var utxt = new Utxt({
    text: req.body.text,
    time: {
      createdAt: aktTime,
      lastModified: aktTime
    },
    _creator: req.user._id
  });

  utxt.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/utxts', authenticate, (req, res) => {
  Utxt.find({
    _creator: req.user._id
  }).then((utxts) => {
    res.send({utxts});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/utxts/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Utxt.findOne({
    _id: id,
    _creator: req.user._id
  }).then((utxt) => {
    if (!utxt) {
      return res.status(404).send();
    }

    res.send({utxt});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/utxts/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const utxt = await Utxt.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (!utxt) {
      return res.status(404).send();
    }

    res.send({utxt});
  } catch (e) {
    res.status(400).send();
  }
});

app.patch('/utxts/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  body.time = {};
  const aktTime = new Date().getTime();
  
  body.time.lastModified = aktTime;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.time.completedAt = aktTime;
  } else {
    body.completed = false;
    body.time.completedAt = null;
  }
  
  Utxt.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((utxt) => {
    if (!utxt) {
      return res.status(404).send();
    }

    res.send({utxt});
  }).catch((e) => {
    res.status(400).send();
  })
});

// POST /users
app.post('/users', async (req, res) => {  // signin
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();

    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {  // loggedin
  res.send(req.user);
});

// Einloggen nach Delete user noch möglich; nur 1 Token jeweils gespeichert
app.post('/users/login', async (req, res) => {  // login
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => { // logout
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
