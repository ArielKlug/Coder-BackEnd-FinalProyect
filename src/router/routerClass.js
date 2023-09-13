const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/objectConfig");

class RouterClass {
  constructor() {
    this.router = Router();
    this.init();
  }

  
  applyCallbacks(callbacks) {
    
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500).send(error);
      }
    });
  }
  init() {}

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === "PUBLIC") return next();

    const token = req.cookies["coderCookie"];
   
    if (!token) return res.send({ status: "error", error: "No authorization" });

    const {user} = jwt.verify(token, JWT_PRIVATE_KEY);

    if (!policies.includes(user.role.toUpperCase()))
      return res
        .status(403)
        .send({ status: "error", error: "Not permissions" });
    req.user = user;

    next();
  };

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (payload) => res.send({ status: "success", payload });
    res.sendServerError = (error) => res.send({ status: "error", error });
    res.sendUserError = (error) => res.send({ status: "error", error });
    next();
  };


  getRouter() {
    return this.router;
  }
 
  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }
  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }
  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }
}

module.exports = {
  RouterClass,
};
