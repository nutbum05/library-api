const express = require('express');

const app = express();
const User = require('./controllers/user');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});

app.post('/user', User.create);


module.exports = app;
