import { EventEmitter } from 'events';
import storage from '../utils/storage.js';

const emitter = new EventEmitter

emitter.on('register', async (req, res) => {
    try {

        const { email, password, name } = req.body

        if (!email || !password || !name) {
            res.setHeader('Content-Type', 'application.json');
            res.statusCode = 400;
            res.end(JSON.stringify({error: 'email, password and name are required '}));
            return;
        }

        const users = await storage.read('users.json');

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            res.setHeader('Content-Type', 'application.json');
            res.statusCode = 400;
            res.end(JSON.stringify({error: 'Email already exists '}));
            return;
        }

        const newUser = { id: Date.now(), email, password, name};
        await storage.add('users.json', newUser);

        const { password: _, ...usersWithoutPassword } = newUser;

        res.setHeader('Content-Type', 'application.json');
        res.statusCode = 201;
        res.end(JSON.stringify(usersWithoutPassword));
    }   catch (e) {
        res.setHeader('Content-Type', 'application.json');
        res.statusCode = 500;
        res.end(JSON.stringify({error: e.message }));
    }
    
});

emitter.on('login', async (req, res) => {
  try {
    const { email, password } = req.body;
 
    const users = await storage.read('users.json');
 
    const user = users.find(u => u.email === email && u.password === password);
 
    if (!user) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Invalid email or password' }));
      return;
    }
 
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ id: user.id, email: user.email, name: user.name }));
  } catch (e) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

emitter.on('profile', async (req, res) => {
  try {
    const { id } = req.query;
 
    const users = await storage.read('users.json');
 
    const user = users.find(u => u.id === Number(id));
 
    if (!user) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }
 
    const { password: _, ...userWithoutPassword } = user;
 
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(userWithoutPassword));
  } catch (e) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

export default emitter;