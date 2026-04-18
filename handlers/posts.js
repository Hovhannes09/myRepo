import { EventEmitter } from 'events';
import storage from '../utils/storage.js';

const emitter = new EventEmitter();

emitter.on('createPost', async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (!userId || !title || !content) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'userId, title and content are required' }));
      return;
    }

    const users = await storage.read('users.json');
    const user = users.find(u => u.id === Number(userId));

    if (!user) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    const newPost = {
      id: Date.now(),
      userId: Number(userId),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    await storage.add('posts.json', newPost);

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 201;
    res.end(JSON.stringify(newPost));
  } catch (e) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

emitter.on('allPosts', async (req, res) => {
  try {
    const posts = await storage.read('posts.json');

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(posts));
  } catch (e) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

emitter.on('deletePost', async (req, res) => {
  try {
    const { id } = req.query;

    const posts = await storage.read('posts.json');
    const postIndex = posts.findIndex(p => p.id === Number(id));

    if (postIndex === -1) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Post not found' }));
      return;
    }

    posts.splice(postIndex, 1);
    await storage.write('posts.json', posts);

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ deleted: true }));
  } catch (e) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

export default emitter;