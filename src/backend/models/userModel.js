const { usersDb } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (user) => {
    user._id = user.email;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return usersDb.post(user);
  },
  findById: (id) => usersDb.get(id),
  findAll: () => usersDb.allDocs({ include_docs: true }),
  update: (id, user) => usersDb.put({ ...user, _id: id }),
  delete: (id, rev) => usersDb.remove(id, rev),
};

module.exports = User;
