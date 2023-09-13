class MessageRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getMessages = async () => {
    return await this.dao.get();
  };

  createMessage = async (newMessage) => {
    return await this.dao.create(newMessage);
  };
}

module.exports = MessageRepository;
