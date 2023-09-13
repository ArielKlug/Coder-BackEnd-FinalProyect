const { logger } = require("../config/logger");

class ViewsController {
  register = async (req, res) => {
    try {
      res.render("registerForm", {
        style: "index.css",
      });
    } catch (error) {
      logger.error(error);
    }
  };
  login = async (req, res) => {
    try {
      res.render("login", {
        style: "index.css",
      });
    } catch (error) {
      logger.error(error);
    }
  };
  passRestore = async (req, res) => {
    try {
      if (req.cookies["emailCookie"]) {
        const { email } = req.params;
        return res.render("passRestore", {
          style: "index.css",
          email,
        });
      } else {
        return res.render("emailPassRestoration", {
          style: "index.css",
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };
  chat = async (req, res) => {
    try {
      if (req.user) {
        return res.render("chat", {});
      }
      res.render("login", {
        style: "index.css",
      });
    } catch (error) {
      logger.error(error);
    }
  };
  emailPassRestoration = async (req, res) => {
    try {
      res.render("emailPassRestoration", {
        style: "index.css",
      });
    } catch (error) {
      logger.error(error);
    }
  };
  userManagerAdmin = async (req, res) => {
    try {
      if (!req.user) {
        return res.res({ status: "error", error: "No authenticated" });
      }
      if (req.user.role !== "admin") {
        return res.res({ status: "error", error: "No permission" });
      }
      res.render("userManagerAdmin", {
        style: "index.css",
      });
    } catch (error) {
      logger.error(error);
    }
  };
}

module.exports = new ViewsController();
