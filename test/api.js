const axios = require('axios');
const request = axios.create({
  baseURL: 'http://localhost:4567'
});

const getPost = () => request.get('/endpoint').then(res => {
  return {
    title: res.data.title,
    tagline: res.data.tagline,
    likes: res.data.likes,
    hidden: res.data.hidden
  };
});

const postTitle = (title) => request.post('/endpoint', { title }).then(res => res.data.title);

module.exports = {
  getPost,
  postTitle
};