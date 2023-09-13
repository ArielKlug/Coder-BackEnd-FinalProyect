class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getUsers = async () => {
    return await this.dao.get();
  };
  getUserBy = async (param) => {
    return await this.dao.getBy(param);
  };
  createUser = async (newUser) => {
    return await this.dao.create(newUser);
  };
  updateUser = async (uid, doc) => {
    return await this.dao.update(uid, doc);
  };
  deleteUser = async (uid) => {
    return await this.dao.delete(uid);
  };
}

module.exports = UserRepository;
