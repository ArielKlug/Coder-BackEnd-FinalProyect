const dataBase = require("../config/objectConfig");

let TicketDao;
let ProductDao;
let CartDao;
let UserDao;
let MessageDao;

switch (process.env.PERSISTENCE) {
  case "MONGO":
    dataBase.connectDB();
    const ProductDaoMongo = require("./mongo/productManagerMongo");
    const CartDaoMongo = require("./mongo/cartManagerMongo");
    const UserDaoMongo = require("./mongo/userManagerMongo");
    const TicketDaoMongo = require("./mongo/ticketManagerMongo");
    const MessagesDaoMongo = require("./mongo/messageManagerMongo");

    ProductDao = ProductDaoMongo;
    CartDao = CartDaoMongo;
    UserDao = UserDaoMongo;
    TicketDao = TicketDaoMongo;
    MessageDao = MessagesDaoMongo;
    break;

  case "FILE":
    const ProductDaoFile = require("../daos/files/ProductManagerFile");
    const CartDaoFile = require("../daos/files/CartManagerFile");
    const UserDaoFile = require("../daos/files/UserManagerFile");
    const TicketDaoFile = require("../daos/files/TicketManagerFile");
    const MessagesDaoFile = require("./files/messageManagerFile");

    ProductDao = ProductDaoFile;
    CartDao = CartDaoFile;
    UserDao = UserDaoFile;
    TicketDao = TicketDaoFile;
    MessageDao = MessagesDaoFile;
    break;
  default:
    break;
}

module.exports = {
  ProductDao,
  CartDao,
  UserDao,
  TicketDao,
  MessageDao,
};
