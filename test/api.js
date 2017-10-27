const axios = require('axios');
const request = axios.create({
  baseURL: 'http://localhost:4567'
});

const getTitle = () => request.get('/endpoint').then(res => res.data.title);

module.exports = {
  getTitle
};