const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/objectConfig");


const generateToken = (user) => {
  const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: "1d" });
  return token;
};

module.exports = {
  generateToken,
};
