const { userModel } = require("./models/userModel");

class UserManagerMongo {
  create = async (newUser) => {
    return await userModel.create(newUser);
  };
  get = async () => {
    return await userModel.find();
  };
  getBy = async (param) => {
    return await userModel.findOne(param);
  };

  update = async (uid, doc) => {
    return await userModel.findByIdAndUpdate(uid, { $set: doc });
  };
  delete = async (uid) => {
    return await userModel.findByIdAndDelete(uid);
  };
}

module.exports = UserManagerMongo;
