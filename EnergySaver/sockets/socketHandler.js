// Socket.io handler for real-time energy updates
const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Client joins a home room to receive updates for that home
    socket.on('joinHome', (homeId) => {
      socket.join(homeId);
      console.log(`Socket ${socket.id} joined home: ${homeId}`);
    });

    // Client leaves a home room
    socket.on('leaveHome', (homeId) => {
      socket.leave(homeId);
      console.log(`Socket ${socket.id} left home: ${homeId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
