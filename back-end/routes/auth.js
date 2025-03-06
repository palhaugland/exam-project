const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { Op } = require('sequelize'); 
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password are required.' });
        }

        // Find the user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid username or password.' });
        }

        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: 'Invalid username or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                roleId: user.roleId,
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } 
        );

        // Return success response with token and user details
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user.id,
                username: user.username,
                roleId: user.roleId,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;