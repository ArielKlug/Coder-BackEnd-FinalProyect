class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getProducts = async () => {
    return await this.dao.get();
  };

  getProductBy = async (params) => {
    return await this.dao.getBy(params);
  };
  createProduct = async (newProduct) => {
    return await this.dao.create(newProduct);
  };

  updateProduct = async (pid, prodToReplace) => {
    return await this.dao.update(pid, prodToReplace);
  };
  deleteProduct = async (pid) => {
    return await this.dao.delete(pid);
  };
}

module.exports = ProductRepository;
