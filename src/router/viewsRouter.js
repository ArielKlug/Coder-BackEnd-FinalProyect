const {
  register,
  login,
  passRestore,
  chat,
  emailPassRestoration,
  userManagerAdmin,
} = require("../controllers/viewsController");
const { RouterClass } = require("./routerClass");

class ViewsRouter extends RouterClass {
  init() {
    this.get("/views/register", ["PUBLIC"], register);
    this.get("/", ["PUBLIC"], login);
    this.get("/views/passRestore/:email", ["PUBLIC"], passRestore);
    this.get("/chat", ["USER"], chat);
    this.get("/views/emailPassRestoration", ["PUBLIC"], emailPassRestoration);
    
  }
}

module.exports = { ViewsRouter };
