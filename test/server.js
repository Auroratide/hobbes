const express = require('express');
const app = express();

app.get('/endpoint', (req, res) => {
  res.status(200).json({
    id: '12345',
    title: 'Title'
  });
});

module.exports = app;
