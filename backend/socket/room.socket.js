const activeRooms = {};

const roomSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join-room", ({ roomCode, user }) => {
      if (!roomCode || !user) return;

      socket.join(roomCode);

      if (!activeRooms[roomCode]) activeRooms[roomCode] = [];

      const alreadyJoined = activeRooms[roomCode].some(
        (member) => member.socketId === socket.id
      );

      if (!alreadyJoined) {
        activeRooms[roomCode].push({
          socketId: socket.id,
          userId: user._id,
          name: user.name,
          email: user.email,
        });
      }

      io.to(roomCode).emit("room-users", activeRooms[roomCode]);

      socket.to(roomCode).emit("user-joined", {
        name: user.name,
        message: `${user.name} joined the room`,
      });
    });

    socket.on("leave-room", ({ roomCode, user }) => {
      if (!roomCode || !user) return;

      socket.leave(roomCode);

      if (activeRooms[roomCode]) {
        activeRooms[roomCode] = activeRooms[roomCode].filter(
          (member) => member.socketId !== socket.id
        );

        io.to(roomCode).emit("room-users", activeRooms[roomCode]);

        socket.to(roomCode).emit("user-left", {
          name: user.name,
          message: `${user.name} left the room`,
        });

        if (activeRooms[roomCode].length === 0) {
          delete activeRooms[roomCode];
        }
      }
    });

    socket.on("send-message", ({ roomCode, message }) => {
      if (!roomCode || !message) return;
      io.to(roomCode).emit("receive-message", message);
    });

    socket.on("draw-start", ({ roomCode, point }) => {
      if (!roomCode || !point) return;
      socket.to(roomCode).emit("draw-start", point);
    });

    socket.on("draw-move", ({ roomCode, point }) => {
      if (!roomCode || !point) return;
      socket.to(roomCode).emit("draw-move", point);
    });

    socket.on("draw-end", ({ roomCode }) => {
      if (!roomCode) return;
      socket.to(roomCode).emit("draw-end");
    });

    socket.on("clear-board", ({ roomCode }) => {
      if (!roomCode) return;
      io.to(roomCode).emit("clear-board");
    });

    socket.on("disconnecting", () => {
      const joinedRooms = [...socket.rooms].filter((room) => room !== socket.id);

      joinedRooms.forEach((roomCode) => {
        if (activeRooms[roomCode]) {
          const leavingUser = activeRooms[roomCode].find(
            (member) => member.socketId === socket.id
          );

          activeRooms[roomCode] = activeRooms[roomCode].filter(
            (member) => member.socketId !== socket.id
          );

          socket.to(roomCode).emit("room-users", activeRooms[roomCode]);

          if (leavingUser) {
            socket.to(roomCode).emit("user-left", {
              name: leavingUser.name,
              message: `${leavingUser.name} left the room`,
            });
          }

          if (activeRooms[roomCode].length === 0) {
            delete activeRooms[roomCode];
          }
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

module.exports = roomSocket;