const { logger } = require("../config/logger");
const { UserDto } = require("../dto/userDto");
const { cartService } = require("../services/cartService");
const { productService } = require("../services/productService");
const { ticketService } = require("../services/ticketService");
const { userService } = require("../services/userService");

class CartsController {
  getAllCarts = async (req, res) => {
    try {
      const user = req.user;
      if (user.role !== "admin") {
        return res.send({ status: "error", message: "Not permission" });
      }
      const carts = await cartService.getCarts();
      res.send({ status: "success", payload: carts });
    } catch (error) {
      logger.error(error);
    }
  };
  getOneCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const user = req.user;
      if (user.role === "admin") {
        return res.send({
          status: "error",
          message: "Admin not allowed to spy 1 cart",
        });
      }
      if (user.role === "user" || user.role === "user.premium") {
        const cart = await cartService.getCartBy({ _id: cid });

        if (!cart) {
          return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const cartData = cart.toObject();

        res.render("cart", {
          cart: cartData,
          cartId: cid,
          style: "../public/css/index.css",
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };
  prePurchase = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartBy({ _id: cid });

      if (cart.products.length === 0) {
        return res.send({
          status: "error",
          payload:
            "No hay nada en el carrito, date una vuelta por el mercadito del Tío Ari :)",
        });
      }
      const userDB = await userService.getUserBy({ _id: cart.userId });
      const normalizedUser = new UserDto(userDB);
      let total = 0;

      cart.products.forEach((item) => {
        total += item.product.price * item.quantity;
      });
      const totalReal = Number(total.toFixed(2));
      const cartData = cart.toObject();
      res.render("purchase", {
        cart: cartData,
        cartId: cid,
        total: totalReal,
        user: normalizedUser,
      });
    } catch (error) {
      logger.error(error);
    }
  };
  purchase = async (req, res) => {
    try {
      const { address } = req.body;
      const { cid } = req.params;
      const cart = await cartService.getCartBy({ _id: cid });
      const user = req.user;
      
      if (!user) {
        return res.send({ status: "error", error: "No authenticated" });
      }
      if (user.role !== "user" && user.role !== "user_premium") {
        return res.send({ status: "error", error: "No authenticated" });
      }
      if (cart.products.length === 0) {
        return res.send({
          status: "error",
          payload:
            "No hay nada en el carrito, date una vuelta por el mercadito del Tío Ari :)",
        });
      }
      const outstockedProds = [];

      cart.products.forEach(async (item) => {
        let stock = item.product.stock;

        let pid = item.product._id;

        if (stock >= item.quantity) {
          item.product.stock -= item.quantity;

          await productService.updateProduct(pid, {
            stock: item.product.stock,
          });
        } else {
          outstockedProds.push(item);
        }
      });

      let productsToBuy = cart.products.filter(
        (item) =>
          !outstockedProds.some((p) => p.product._id === item.product._id)
      );
      let ticketResult;
      if (productsToBuy.length > 0) {
        const date = new Date().toLocaleString("en-GB", {
          hour12: false,
        });
        const ticket = {
          purchaseDateTime: date,
          amount: productsToBuy
            .reduce(
              (total, item) => total + item.quantity * item.product.price,
              0
            )
            .toFixed(2),
          purchaser: cart.userId,
          destination: address,
        };
        ticketResult = await ticketService.createTicket(ticket);
      }
      let ticket;
      if (outstockedProds.length > 0) {
        cart.products = outstockedProds;
        await cartService.updateCart(cid, cart);

        let productsNotBuyed = [];
        outstockedProds.forEach((item) => {
          productsNotBuyed.push(item.product._id);
        });
        ticket = ticketResult.toObject();
        return res.render("ticket", {
          ticket: ticket,
          prodsInCart: productsNotBuyed,
        });
      } else {
        await cartService.emptyCart(cid);
        ticket = ticketResult.toObject();
        return res.render("ticket", {
          ticket: ticket,
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };
  addProdToCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;
      const user = req.user;

      if (user.role === "admin") {
        return res.send({ status: "error", message: "An admin can not buy" });
      }
      const product = await productService.getProductBy({ _id: pid });
      if (user.role === "user_premium" && product.owner === user.email) {
        return res.status(403).send({
          status: "error",
          message: "No puedes agregar tu propio producto al carrito",
        });
      }
      const findedCart = await cartService.getCartBy({ _id: cid });
      if (!findedCart) {
        return res.send({ status: "error", error: "Cart not found" });
      }
      const foundProductIndex = findedCart.products.findIndex(
        (prod) => prod.product.id === pid
      );

      if (foundProductIndex !== -1) {
        await cartService.updateQuantityOfProduct(cid, pid);
      } else {
        const cart = await cartService.getCartBy({ _id: cid });

        if (!cart) {
          logger.warning("Carrito no encontrado");
          return;
        }

        cart.products.push({ product: pid, quantity: 1 });
        await cart.save();
      }

      
      const updatedCart = await cartService.getCartBy({ _id: cid });

      return res.redirect("http://localhost:8080/api/products");
    } catch (error) {
      logger.error(error);
    }
  };
  emptyCart = async (req, res) => {
    try {
      const { cid } = req.params;
      await cartService.emptyCart(cid);
      const cart = await cartService.getCartBy({ _id: cid });
      res.status(200).send(cart);
    } catch (error) {
      logger.error(error);
    }
  };
  deleteProdFromCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.params;
      const user = req.user;

      if (user.role === "admin") {
        return res.send({
          status: "error",
          message: "Admin can not delete products form carts",
        });
      }
      if (user.role === "user" || user.role === "user_premium") {
        const cart = await cartService.getCartBy({ _id: cid });

        const index = cart.products.find((product) => product._id === pid);

        if (index !== -1) {
          cart.products.splice(index, 1);
          await cartService.updateCart(cid, cart);
        } else {
          return res.send({
            status: "error",
            error: "Product not found in cart",
          });
        }
        const updatedCart = await cartService.getCartBy({ _id: cid });
        return res.send({ status: "success", payload: updatedCart });
      }
    } catch (error) {
      logger.error(error);
    }
  };
}

module.exports = new CartsController();
