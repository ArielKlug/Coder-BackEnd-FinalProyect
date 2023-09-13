const { UserDao } = require("../dao/factory");
const UserRepository = require("../repositories/userRepository");

const userService = new UserRepository(new UserDao());

module.exports = {
  userService,
};
