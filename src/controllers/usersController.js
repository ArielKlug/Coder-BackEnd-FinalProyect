const { logger } = require("../config/logger");
const { userModel } = require("../dao/mongo/models/userModel");
const { UserDto } = require("../dto/userDto");
const { userService } = require("../services/userService");
const moment = require("moment");
const { sendMail } = require("../utils/sendMail");

class UsersController {
  getAllUsers = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await userModel.paginate({}, { page: page, limit: limit });

      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } =
        result;

      const normalizedUsers = docs.map((user) => ({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role,
        last_login: user.last_login,
      }));

      res.render("userManagerAdmin", {
        users: normalizedUsers,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        limit,
      });
    } catch (error) {
      logger.error(error);
    }
  };
  getOneUser = async (req, res) => {
    try {
      const user = req.user;
      const { uid } = req.params;
      if (!req.cookies["coderCookie"]) {
        return res.redirect("http://localhost:8080");
      }
      if (user.role !== "admin") {
        return res.send({ status: "error", error: "No permissions" });
      }
      const findedUser = await userService.getUserBy({ _id: uid });
      if (!findedUser) {
        return res.send({ status: "error", error: "Usuario no encontrado" });
      }
      res.send({ status: "success", payload: findedUser });
    } catch (error) {
      logger.error(error);
    }
  };
  premium = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = req.user;
      let userUpdated;
      let token;
      let normalizedUser;
      let email = user.email;
      switch (user.role) {
        case "user":
          user.role = "user_premium";
          await userService.updateUser(uid, user);

          userUpdated = await userService.getUserBy({ email: email });

          normalizedUser = new UserDto(userUpdated);

          token = generateToken(normalizedUser);

          return res
            .cookie("coderCookie", token, {
              maxAge: 86400 * 1000,
              httpOnly: true,
            })
            .redirect("http://localhost:8080/api/products");
          break;
        case "user_premium":
          user.role = "user";
          await userService.updateUser(uid, user);
          userUpdated = await userService.getUserBy({ email: email });
          normalizedUser = new UserDto(userUpdated);

          token = generateToken(normalizedUser);
          return res
            .cookie("coderCookie", token, {
              maxAge: 86400 * 1000,
              httpOnly: true,
            })
            .redirect("http://localhost:8080/api/products");
          break;
        default:
          break;
      }
    } catch (error) {
      logger.error(error);
    }
  };
  roleChange = async (req, res) => {
    const { uid, newRole } = req.params;
    const user = req.user;
    if (user.role !== "admin") {
      return res.send({ status: "error", error: "Not permission" });
    }
    if (
      newRole !== "admin" &&
      newRole !== "user" &&
      newRole !== "user_premium"
    ) {
      return res
        .status(400)
        .send({ status: "error", message: "Rol no válido" });
    }
    await userService.updateUser(uid, { role: newRole });

    res.send({
      status: "success",
      message: "Rol del usuario modificado con éxito",
    });
  };
  deleteInactive = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.send({ status: "error", error: "No Authentication" });
      }

      if (user.role !== "admin") {
        return res.send({ status: "error", error: "No permission" });
      }
      const users = await userService.getUsers();
      for (const user of users) {
        const userLastLogin = moment(user.last_login, "DD/M/yyyy, HH:mm:ss");
        const fechaActual = moment();
        const daysDifference = fechaActual.diff(userLastLogin, "days");
        if (daysDifference >= 2) {
          let destinatario = user.email;
          let asunto = "Cuenta Eliminada por Inactividad";
          let html = `<h1>Cuenta Eliminada por Inactividad</h1>
      <p>Estimado/a ${user.first_name} ${user.last_name}</p>
      
      <p>Le informamos que su cuenta ha sido eliminada debido a la inactividad en su uso. Lamentamos la pérdida de su cuenta y le agradecemos por haber sido parte de nuestra comunidad.</p>
  
      <p>Si desea volver a utilizar nuestros servicios, le invitamos a crear una nueva cuenta en nuestro sitio web.</p>
  
      <p>Gracias por su comprensión.</p>
      
      <p>Atentamente,</p>
      <p>El Equipo de Soporte</p>`;
          await sendMail(destinatario, asunto, html);
          await userService.deleteUser(user._id);
        }
      }
      const confirmDelete = await userService.getUsers();
      if (users.length > confirmDelete.length) {
        return res.send({ status: "success", message: "Usuarios eliminados" });
      } else {
        return res.send({
          status: "error",
          message: "No hay usuarios con tiempo de inactividad de 2 días o más",
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };
  deleteUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = req.user;

      if (!user) {
        return res.send({ status: "error", error: "No Authentication" });
      }

      if (user.role !== "admin") {
        return res.send({ status: "error", error: "No permission" });
      }

      if (!uid) {
        return res.send({ status: "error", error: "No user Id" });
      }

      await userService.deleteUser(uid);

      res.send({
        status: "success",
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      logger.error(error);
    }
  };
}

module.exports = new UsersController();
