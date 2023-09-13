const { TicketDao } = require("../dao/factory");
const ticketRepository = require("../repositories/ticketRepository");

const ticketService = new ticketRepository(new TicketDao());

module.exports = {
  ticketService,
};
