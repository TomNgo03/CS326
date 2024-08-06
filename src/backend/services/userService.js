const { userDb } = require('../db/pouchdb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {JWT_SECRET} = require('../config');

async function registerUser(userData) {
    const existingUser = await userDb.find({
        selector: { email: userData.email }
    });

    if (existingUser.docs.length > 0) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = {
        ...userData,
        password: hashedPassword,
        _id: new Date().toISOString()
    };

    const response = await userDb.put(user);
    return { ...user, _rev: response.rev };
}

async function loginUser(credentials) {
    const user = await userDb.find({
        selector: { email: credentials.email }
    });

    if (user.docs.length === 0) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.docs[0].password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user.docs[0]._id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
}

async function getUserById(id) {
    try {
        const user = await userDb.get(id);
        delete user.password; // Remove password before returning user data
        return user;
    } catch (error) {
        throw new Error('User not found');
    }
}

async function updateUser(id, userData) {
    const user = await getUserById(id);

    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = { ...user, ...userData };
    const response = await userDb.put(updatedUser);
    return { ...updatedUser, _rev: response.rev };
}

async function deleteUser(id) {
    const user = await getUserById(id);
    await userDb.remove(user);
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
};
