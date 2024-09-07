import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 Module Syntax for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3040;

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a client is connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  setInterval(() => {
    const x = Math.floor(Math.random() * 10);
    socket.emit('number', x);
    console.log('Emitting Number ' + x);
  }, 1000);
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to the database
import('./database.js');

// Attach the router
import('./routers/router.js').then((router) => {
  router.default(app);
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Send the HTML file when accessing the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
server.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
