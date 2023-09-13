const nodemailer = require("nodemailer");
const config = require("../config/objectConfig");
const { logger } = require("../config/logger");

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    //credenciales del que utiliza el servicio
    user: config.gmailUserApp,
    pass: config.gmailPassApp,
  },
});

exports.sendMail = async (destinatario, asunto, html) => {
  try {
    return await transport.sendMail({
      from: `Mercadito del Tío Ari <${config.gmailUserApp}>`,
      
      to: `${destinatario}`,
      subject: asunto,
      html: html,
      
    });
  } catch (error) {
    logger(error);
  }
};
