const { connect } = require("mongoose");
const { logger } = require("../config/logger");



class MongoSingleton {
  static #instance;
  constructor() {
  
    connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  static getInstance() {
    if (this.#instance) {
      logger.info("Base de datos previamente conectada");
      return this.#instance;
    }
    this.#instance = new MongoSingleton()
    logger.info('Base de datos conectada correctamente')
    return this.#instance;
  }
}


module.exports = {
    MongoSingleton
}