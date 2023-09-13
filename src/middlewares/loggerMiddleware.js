const { logger } = require("../config/logger");


const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

module.exports = { addLogger };
