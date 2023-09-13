const { logger } = require("../config/logger");
const { productModel } = require("../dao/mongo/models/productModel");
const { productService } = require("../services/productService");
const { userService } = require("../services/userService");
const { sendMail } = require("../utils/sendMail");

class ProductsController {
  createProduct = async (req, res) => {
    try {
      const prod = req.body;
      const user = req.user;

      if (
        user.role === "user" ||
        (user.role !== "admin" && user.role !== "user_premium")
      ) {
        return res.send({ status: "error", message: "Not permission" });
      }

      if (
        !prod.title ||
        !prod.description ||
        !prod.price ||
        !prod.thumbnail ||
        !prod.code ||
        !prod.stock ||
        !prod.category
      ) {
        return res.send({
          status: "error",
          error: "Product incomplete features",
        });
      } else {
        const codeCheck = await productService.getProducts();

        if (codeCheck.find((item) => item.code === prod.code)) {
          return res.send({
            status: "error",
            mensaje: "Ya existe un producto con ese código",
          });
        } else {
          if (user.role === "user_premium") {
            let newProduct = {
              title: prod.title,
              description: prod.description,
              price: prod.price,
              thumbnail: prod.thumbnail,
              code: prod.code,
              stock: prod.stock,
              category: prod.category,
              owner: user.email,
            };
            const productCreated = await productService.createProduct(
              newProduct
            );
            return res
              .status(200)
              .send({ status: "success", payload: productCreated });
          } else {
            let newProduct = {
              title: prod.title,
              description: prod.description,
              price: prod.price,
              thumbnail: prod.thumbnail,
              code: prod.code,
              stock: prod.stock,
              category: prod.category,
              owner: "admin",
            };
            const productCreated = await productService.createProduct(
              newProduct
            );
            return res
              .status(200)
              .send({ status: "success", payload: productCreated });
          }
        }
      }
    } catch (error) {
      logger.error(error);
    }
  };
  getProducts = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort === "desc" ? -1 : 1;
      const category = req.query.category || "";

      let productos;

      if (category === "") {
        productos = await productModel.paginate(
          {},
          {
            limit: limit,
            page: page,
            lean: true,
            sort: { _id: sort, createdAt: 1 },
          }
        );
      } else {
        productos = await productModel.paginate(
          { category: { $eq: category } },
          {
            limit: limit,
            page: page,
            lean: true,
            sort: { _id: sort, createdAt: 1 },
          }
        );
      }

      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } =
        productos;
      if (!docs) {
        return res.send({
          status: "Error",
          message: "Can not find the products",
        });
      }
      const payload = `Se encontraron ${docs.length} productos en la página ${page}`;

      if (req.user) {
        const { first_name, last_name, role, cartId } = req.user;
        return res.render("products", {
          status: "success",
          payload: payload,
          products: docs,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          totalPages,
          limit,
          first_name,
          last_name,
          role,
          cartId,
        });
      } else {
        return res.render("products", {
          status: "success",
          payload: payload,
          products: docs,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
          totalPages,
          limit,
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };
  getOneProduct = async (req, res) => {
    try {
      const { pid } = req.params;

      const result = await productService.getProductBy({ _id: pid });

      return res.send({ status: "success", payload: result });
    } catch (error) {
      logger.error(error);
    }
  };

  updateProduct = async (req, res) => {
    try {
      const user = req.user;
      const { pid } = req.params;
      const prodToReplace = req.body;

      if (!pid) {
        return res.send({
          status: "error",
          message: "Insert valid product Id",
        });
      }
      if (
        !prodToReplace ||
        !prodToReplace.title ||
        !prodToReplace.description ||
        !prodToReplace.price ||
        !prodToReplace.thumbnail ||
        !prodToReplace.code ||
        !prodToReplace.stock ||
        !prodToReplace.category
      ) {
        return res.send({
          status: "error",
          message: "Insert valid updated fields",
        });
      }
      if (user.role === "user_premium") {
        const product = await productService.getProductBy({ _id: pid });

        if (product.owner === user.email) {
          const updatedProduct = await productService.updateProduct(
            pid,
            prodToReplace
          );
          return res
            .status(200)
            .send({ status: "success", payload: updatedProduct });
        } else {
          return res.send({
            status: "Error",
            error: "El producto a actualizar, no le pertenece",
          });
        }
      }
      if (user.role === "admin") {
        const updatedProduct = await productService.updateProduct(
          pid,
          prodToReplace
        );
        return res
          .status(200)
          .send({ status: "success", payload: updatedProduct });
      }
    } catch (error) {
      logger.error(error);
    }
  };
  deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const user = req.user;
      const product = await productService.getProductBy({ _id: pid });
      if (user.role === "user_premium") {
        if (product.owner === user.email) {
          const deletedProd = await productService.deleteProduct(pid);
          let destinatario = user.email;
          let asunto = "Producto Eliminado";
          let html = `<div><h1>Estimado/a ${user.first_name} ${user.last_name}</h1>
    
      <p>Le informamos que su producto con la siguiente información ha sido eliminado:</p>
      <ul>
          <li>Nombre del Producto: ${product.title}</li>
          <li>Descripción: ${product.description}</li>
          <li>Precio: ${product.price}</li>
      </ul>
      <p>Lamentamos los inconvenientes que esto pueda causar. Si tiene alguna pregunta o necesita más información, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
      <p>Gracias por su comprensión.</p>
      <p>Atentamente,</p>
      <p>El mercadito del Tío Ari</p>
    </div>`;
          await sendMail(destinatario, asunto, html);
          return res.send({ status: "success", payload: deletedProd });
        } else {
          return res.send({
            status: "Error",
            error: "El producto a eliminar, no le pertenece",
          });
        }
      }
      if (user.role === "admin") {
        const userPremium = await userService.getUserBy({
          email: product.owner,
        });
        let destinatario = userPremium.email;
        let asunto = "Producto Eliminado";
        let html = `<div><h1>Estimado/a ${userPremium.first_name} ${userPremium.last_name}</h1>
    
      <p>Le informamos que su producto con la siguiente información ha sido eliminado:</p>
      <ul>
          <li>Nombre del Producto: ${product.title}</li>
          <li>Descripción: ${product.description}</li>
          <li>Precio: ${product.price}</li>
      </ul>
      <p>Lamentamos los inconvenientes que esto pueda causar. Si tiene alguna pregunta o necesita más información, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
      <p>Gracias por su comprensión.</p>
      <p>Atentamente,</p>
      <p>El mercadito del Tío Ari</p>
    </div>`;
        await sendMail(destinatario, asunto, html);
        const deletedProd = await productService.deleteProduct(pid);
        return res
          .status(200)
          .send({ status: "success", payload: deletedProd });
      }
    } catch (error) {
      logger.error(error);
    }
  };
}
module.exports = new ProductsController();
