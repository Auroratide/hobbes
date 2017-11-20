const express = require('express');
const bodyparser = require('body-parser');
const app = express();

app.use(bodyparser.json());

app.get('/endpoint', (req, res) => {
  res.status(200).json({
    id: '12345',
    title: 'Title',
    tagline: 'This is a tagline',
    likes: 79
  });
});

app.post('/endpoint', (req, res) => {
  const title = req.body.title;

  res.status(201).json({
    id: '12346',
    title
  });
});

module.exports = app;
