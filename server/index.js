import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { GeographyRoom } from './rooms/GeographyRoom.js';

const app = express();
const port = process.env.PORT || 2567;

// Enable CORS for React app - allow all localhost ports
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Allow specific origins
    const allowedOrigins = ['http://localhost:3000'];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Create HTTP server
const server = createServer(app);

// Create Colyseus server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

// Register the Geography room
gameServer.define('geography_room', GeographyRoom);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Geography Game Server is running!' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Geography Game Server is running!',
    endpoints: {
      health: '/health',
      monitor: '/colyseus'
    }
  });
});

gameServer.listen(port);
console.log(`🎮 Geography Game Server is listening on port ${port}!`); 