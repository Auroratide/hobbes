const express = require('express');
const bodyparser = require('body-parser');
const app = express();

app.use(bodyparser.json());

app.get('/endpoint', (req, res) => {
  res.status(200).json({
    id: '12345',
    title: 'Title',
    tagline: 'This is a tagline',
    likes: 79,
    hidden: false,
    comments: [ {
      id: '1',
      text: 'This is a comment.'
    }, {
      id: '2',
      text: 'I really disliked that post'
    } ]
  });
});

app.post('/endpoint', (req, res) => {
  const title = req.body.title;

  res.status(201).json({
    id: '12346',
    title
  });
});

app.get('/endpoints', (req, res) => {
  const arr = [];
  if(req.query.type === 'fruit') {
    arr.push({ type: 'fruit', name: 'apple' });
  }
  res.status(200).json({
    items: arr
  });
});

app.get('/secret', (req, res) => {
  if(req.headers['client-id'] === 'secret')
    res.status(200).json({ id: '987' });
  else
    res.status(401).json({ error: 'Unauthorized' });
});

module.exports = app;
