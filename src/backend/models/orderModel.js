const { ordersDb } = require('../config/db');

const Order = {
  create: (order) => ordersDb.post(order),
  findById: (id) => ordersDb.get(id),
  findAll: () => ordersDb.allDocs({ include_docs: true }),
  update: (id, order) => ordersDb.put({ ...order, _id: id }),
  delete: (id, rev) => ordersDb.remove(id, rev),
};

module.exports = Order;
