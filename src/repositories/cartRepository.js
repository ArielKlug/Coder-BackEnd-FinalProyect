class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCartBy = async (params) => {
    return await this.dao.getBy(params);
  };

  getCarts = async () => {
    return await this.dao.get();
  };
  createCart = async () => {
    return await this.dao.create();
  };
  
  updateQuantityOfProduct = async (cid, pid) => {
    return await this.dao.updateProductQuantity(cid, pid);
  };

  emptyCart = async (cid) => {
    return await this.dao.emptyCart(cid);
  };
  updateCart = async (cid, cart) => {
    return await this.dao.update(cid, cart);
  };
}

module.exports =  CartRepository ;
