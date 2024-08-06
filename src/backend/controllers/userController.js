const userService = require('../services/userService');

async function registerUser(req, res) {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to register user' });
    }
}

async function loginUser(req, res) {
    try {
        const token = await userService.loginUser(req.body);
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: 'Invalid credentials' });
    }
}

async function getUserById(req, res) {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: 'User not found' });
    }
}

async function updateUser(req, res) {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update user' });
    }
}

async function deleteUser(req, res) {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete user' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
};
