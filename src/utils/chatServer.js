const { logger } = require("../config/logger");
const { messageService } = require("../services/messageService");

const socketChat = async (io) => {
  io.on("connection", (socket) => {
    socket.on("message", async (data) => {
      try {
        await messageService.createMessage(data);
        let messages = await messageService.getMessages();
        io.emit("messageLogs", messages);
      } catch (error) {
        logger.error(error);
      }
    });
    socket.on("authenticated", (data) => {
      socket.broadcast.emit("newUserConnected", data);
    });
  });
};
module.exports = {
  socketChat,
};
