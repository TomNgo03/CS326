const { productsDb } = require('../config/db');

const Product = {
  create: (product) => productsDb.post(product),
  findById: (id) => productsDb.get(id),
  findAll: () => productsDb.allDocs({ include_docs: true }),
  update: (id, product) => productsDb.put({ ...product, _id: id }),
  delete: (id, rev) => productsDb.remove(id, rev),
};

module.exports = Product;
