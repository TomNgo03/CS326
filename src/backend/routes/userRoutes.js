const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// Get user details
router.get('/:id', userController.getUserById);

// Update user details
router.put('/:id', userController.updateUser);

// Delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;
