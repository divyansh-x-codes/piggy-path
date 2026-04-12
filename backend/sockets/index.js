const { Server } = require('socket.io');

let io;

const initSocket = (httpServer, frontendUrl) => {
  io = new Server(httpServer, {
    cors: {
      origin: frontendUrl || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Client can subscribe to a specific stock's updates
    socket.on('subscribe_stock', (stockId) => {
      socket.join(`stock:${stockId}`);
      console.log(`[Socket.io] ${socket.id} subscribed to stock:${stockId}`);
    });

    socket.on('subscribe_user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`[Socket.io] ${socket.id} joined private room user:${userId}`);
    });

    socket.on('unsubscribe_stock', (stockId) => {
      socket.leave(`stock:${stockId}`);
    });

    socket.on('unsubscribe_user', (userId) => {
      socket.leave(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  console.log('[Socket.io] Initialized');
  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
