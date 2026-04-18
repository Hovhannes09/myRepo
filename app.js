import http from 'http';

import usersEmitter from './handlers/users.js';
import postsEmitter from './handlers/posts.js';

import parser from './utils/parser.js';

const server = http.createServer(async function (req, res) {
  try {
    const { method, url } = await parser(req);

    if (method === 'POST' && url === '/login') {
      usersEmitter.emit('login', req, res);
      return;
    }

    if (method === 'POST' && url === '/register') {
      usersEmitter.emit('register', req, res);
      return;
    }

    if (method === 'GET' && url === '/profile') {
      usersEmitter.emit('profile', req, res);
      return;
    }

    if (method === 'POST' && url === '/posts') {
      postsEmitter.emit('createPost', req, res);
      return;
    }

    if (method === 'GET' && url === '/posts') {
      postsEmitter.emit('allPosts', req, res);
      return;
    }

    if (method === 'DELETE' && url === '/posts') {
      postsEmitter.emit('deletePost', req, res);
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
  } catch (e) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

console.log('Hello');


server.listen(8080, function () {
  console.log('Server listening on port 8080');
});