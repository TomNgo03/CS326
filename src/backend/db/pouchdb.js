const PouchDB = require('pouchdb');
const path = require('path');

const productDb = new PouchDB(path.join(__dirname, 'products'));
const userDb = new PouchDB(path.join(__dirname, 'users'));

module.exports = {
    productDb,
    userDb
};
