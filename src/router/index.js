const { Router } = require("express");

const { SessionsRouter } = require("./sessionsRouter");
const sessionsRouter = new SessionsRouter()
;
const { ViewsRouter } = require("./viewsRouter");
const viewsRouter = new ViewsRouter();

const { ProductsRouter } = require("./productsRouter");
const productsRouter = new ProductsRouter();

const { CartsRouter } = require("./cartsRouter");
const cartsRouter = new CartsRouter();

const { UsersRouter } = require("./usersRouter");
const usersRouter = new UsersRouter();

const router = Router();

router.use("/api/sessions", sessionsRouter.getRouter());
router.use("/", viewsRouter.getRouter());
router.use("/api/products", productsRouter.getRouter());
router.use("/api/carts", cartsRouter.getRouter());
router.use("/api/users", usersRouter.getRouter());

module.exports = router;
