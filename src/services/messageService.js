const { MessageDao } = require("../dao/factory");
const MessageRepository = require("../repositories/mesaggeRepository");

const messageService = new MessageRepository(new MessageDao());

module.exports = { messageService };
