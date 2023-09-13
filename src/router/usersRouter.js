const {
  getAllUsers,
  getOneUser,
  premium,
  deleteUser,
  deleteInactive,
  roleChange,
} = require("../controllers/usersController");
const { RouterClass } = require("./routerClass");

class UsersRouter extends RouterClass {
  init() {
    this.get("/", ["ADMIN"], getAllUsers);
    this.get("/:uid", ["ADMIN"], getOneUser);
    this.get("/premium/:uid", ["USER", "USER_PREMIUM"], premium);
    this.put('/:uid/role/:newRole', ["ADMIN"], roleChange)
    this.delete("/:uid", ["ADMIN"], deleteUser);
    this.delete("/", ["ADMIN"], deleteInactive);
  }
}

module.exports = { UsersRouter };
