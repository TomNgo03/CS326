const PouchDB = require('pouchdb-node');

const productsDb = new PouchDB('products');
const usersDb = new PouchDB('users');
const ordersDb = new PouchDB('orders');

const initDb = () => {
  console.log('Databases initialized');
};

module.exports = {
  productsDb,
  usersDb,
  ordersDb,
  initDb,
};
