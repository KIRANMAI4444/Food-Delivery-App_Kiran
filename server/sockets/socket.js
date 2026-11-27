import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Allow connections from the frontend
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('⚡ A user connected:', socket.id);

    // When the frontend joins a specific order room
    socket.on('joinOrderRoom', (orderId) => {
      socket.join(orderId);
      console.log(`User joined room: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 User disconnected');
    });
  });

  return io;
};

// Function to get the io instance from anywhere in the app
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
