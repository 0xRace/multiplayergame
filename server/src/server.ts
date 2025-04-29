import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, this should be restricted to your client domain
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Health check endpoint
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 