const { usersDb } = require('../config/db');

const User = {
  create: (user) => usersDb.post(user),
  findById: (id) => usersDb.get(id),
  findAll: () => usersDb.allDocs({ include_docs: true }),
  update: (id, user) => usersDb.put({ ...user, _id: id }),
  delete: (id, rev) => usersDb.remove(id, rev),
};

module.exports = User;
