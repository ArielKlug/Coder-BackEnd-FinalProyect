const { logger } = require("../config/logger");
const { UserDto } = require("../dto/userDto");
const { cartService } = require("../services/cartService");
const { userService } = require("../services/userService");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const { generateToken } = require("../utils/generateTokenJwt");
const { sendMail } = require("../utils/sendMail");

class SessionsController {
  register = async (req, res) => {
    try {
      const { first_name, last_name, age, email, password } = req.body;
      if (!age || !first_name || !last_name || !email || !password) {
        return res.userError("All fields are necesary");
      }

      const existentUser = await userService.getUserBy({ email: email });
      if (existentUser) {
        return res.send({
          status: "error",
          error: "Ya hay una cuenta registrada con ese email",
        });
      }
      const newCart = {
        products: [],
        userId: "",
      };

      const cart = await cartService.createCart(newCart);

      const newUser = {
        first_name: first_name,
        last_name: last_name,
        age: age,
        email: email,
        password: createHash(password),
        cartId: cart._id,
        role: "user",
      };

      const newUserMongo = await userService.createUser(newUser);

      const userId = newUserMongo._id;

      if (!userId) {
        return res.send({ status: "error", error: "Error creating new user" });
      }

      const cartToUpdate = await cartService.getCartBy({ _id: cart._id });
      cartToUpdate.userId = userId;
      await cartToUpdate.save();

      res.status(200).redirect("http://localhost:8080/");
    } catch (error) {
      logger.error(error);
    }
  };
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email == "" || password == "") {
        return res.send("Complete todos los campos para iniciar sesión");
      }
      const userDB = await userService.getUserBy({ email: email });

      if (!userDB) {
        return res.send({
          status: "error",
          message: "No existe ese usuario, revise los campos",
        });
      }
      let verifyPass = isValidPassword(password, userDB);

      if (!verifyPass) {
        return res.send({
          status: "error",
          error: "Email or password incorrect",
        });
      }
      await userService.updateUser(
        { _id: userDB._id },
        {
          last_login: new Date().toLocaleString(),
        }
      );
      let userToToken = new UserDto(userDB);

      const access_token = generateToken(userToToken);

      if (!access_token) {
        return res.send({
          status: "error",
          message: "Token generation error",
        });
      }

      res
        .cookie("coderCookie", access_token, {
          maxAge: 86400 * 1000,
          httpOnly: true,
        })
        .redirect("http://localhost:8080/api/products");
    } catch (error) {
      logger.error(error);
    }
  };
  emailPassRestoration = async (req, res) => {
    try {
      const { email } = req.body;

      const userDB = await userService.getUserBy({ email: email });

      if (!userDB) {
        return res
          .status(401)
          .send({ status: "error", message: "El usuario no existe" });
      }
      let user = new UserDto(userDB);
      const token = generateToken(user);

      let destinatario = email;
      let asunto = "Restablecer contraseña del mercadito del tío Ari :)";
      let html = `<div><h1>Para restaurar su contraseña, haga click en el botón</h1>
    
    <a href="http://localhost:8080/views/passRestore/${email}"><button>Restaurar contraseña</button></a>
    </div>`;
      await sendMail(destinatario, asunto, html);
      
      res
        .cookie("emailCookie", token, {
          maxAge: 3600 * 1000,
          httpOnly: true,
        })
        .redirect("http://localhost:8080/");
    } catch (error) {
      logger.error(error);
    }
  };
  passRestoration = async (req, res) => {
    try {
      if (!req.cookies["emailCookie"]) {
        res.redirect("http://localhost:8080/views/emailRestorePass");
      }

      const { email, newPassword, confirmPassword } = req.body;

      const userDB = await userService.getUserBy({ email: email });

      if (!userDB) {
        return res
          .status(401)
          .send({ status: "error", message: "El usuario no existe" });
      }

      if (newPassword === confirmPassword) {
        
        let isValid = isValidPassword(newPassword, userDB);

        if (isValid) {
          return res.send({
            status: "error",
            message: "no podes poner la misma contraseña de antes",
          });
        }

        userDB.password = createHash(newPassword);

        await userDB.save();

        return res.send({
          status: "success",
          message: "Contraseña actualizada correctamente",
        });
      } else {
        return res.send({
          status: "error",
          message: "Las contraseñas no coinciden",
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };
  failRegister = async (req, res) => {
    try {
      logger.info("Falla de autenticación");
      res.send({
        status: "error",
        message: "Falló la autenticación del registro",
      });
    } catch (error) {
      logger.error(error);
    }
  };
  failLogin = async (req, res) => {
    try {
      logger.info("Falla de autenticación");
      res.send({
        status: "error",
        message: "Falló la autenticación del login",
      });
    } catch (error) {
      logger.error(error);
    }
  };
  current = async (req, res) => {
    try {
      if (!req.user) {
        res.send({ stats: "error", error: "No authenticated" });
      }
      if (!req.user.role) {
        res.send({ stats: "error", error: "No authenticated" });
      }
      let user = new UserDto(req.user);
      res.send(user);
    } catch (error) {
      logger.error(error);
    }
  };
  logout = async (req, res) => {
    try {
      if (!req.cookies["coderCookie"]) {
        return res.send({
          status: "error",
          error: "¿Cómo entraste acá sin estar autenticado?",
        });
      }
      res.clearCookie("coderCookie").redirect("http://localhost:8080/");
    } catch (error) {
      logger.error(error);
    }
  };
}
module.exports = new SessionsController();
