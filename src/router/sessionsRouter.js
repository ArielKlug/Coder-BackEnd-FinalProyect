const {
  failRegister,
  failLogin,
  current,
  register,
  login,
  emailPassRestoration,
  passRestoration,
  logout,
} = require("../controllers/sessionsController");
const { RouterClass } = require("./routerClass");

class SessionsRouter extends RouterClass {
  init() {
    this.get("/failRegister", ["PUBLIC"], failRegister);
    this.get("failLogin", ["PUBLIC"], failLogin);
    this.get("/current", ["USER", "USER_PREMIUM", "ADMIN"], current);
    this.get('/logout', ["USER", "USER_PREMIUM", "ADMIN"], logout)
    this.post("/register", ["PUBLIC"], register);
    this.post("/login", ["PUBLIC"], login);
    this.post("/emailPassRestoration", ["PUBLIC"], emailPassRestoration);
    this.post("/passRestoration/", ["PUBLIC"], passRestoration);
  }
}

module.exports = { SessionsRouter };
