class TicketRepository {
    constructor(dao) {
      this.dao = dao;
    }
    getTickets = async () => {
      return await this.dao.get();
    };
  
    getTicketBy = async (params) => {
      return await this.dao.getBy(params);
    };
    createTicket = async (newTicket) => {
      return await this.dao.create(newTicket);
    };
  
    updateTicket = async (tid, doc) => {
      return await this.dao.update(tid, doc);
    };
    deleteTicket = async (tid) => {
      return await this.dao.delete(tid);
    };
  }
  
  module.exports = TicketRepository;
  