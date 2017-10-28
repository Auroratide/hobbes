const axios = require('axios');
const request = axios.create({
  baseURL: 'http://localhost:4567'
});

const getTitle = () => request.get('/endpoint').then(res => res.data.title);

const postTitle = (title) => request.post('/endpoint', { title }).then(res => res.data.title);

module.exports = {
  getTitle,
  postTitle
};