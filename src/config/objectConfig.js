const { commander } = require("../utils/commander");
const dotenv = require("dotenv");
const { MongoSingleton } = require("../utils/sigleton");
const { mode } = commander.opts();
dotenv.config({
  path: mode === "development" ? "./.env.development" : "./.env.production",
});

const enviroment = process.env.MODE

const JWT_PRIVATE_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
  enviroment,
  JWT_PRIVATE_KEY,
  gmailUserApp: process.env.GMAIL_USER_APP,
  gmailPassApp: process.env.GMAIL_PASS_APP,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  myPhoneNumber: process.env.MY_PHONE_NUMBER,
  connectDB: async () => await MongoSingleton.getInstance(),
};
