const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const { User, Role, sequelize } = require('../models');
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
            JWT_SECRET,
            { expiresIn: '2h' } // Token expires in 2 hours
        );

        // Return success response with token
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


// Register route
router.post('/register', async (req, res) => {
    const { firstname, lastname, username, email, password, address, phone } = req.body;

    try {
        // Validate required fields
        if (!firstname || !lastname || !username || !email || !password || !address || !phone) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }

        // Check if email or username already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email },
                ],
            },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Username or email is already in use.',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user with default role (User)
        const newUser = await User.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            address,
            phone,
            roleId: 2, // Default role: User (as per Roles table setup in /init)
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;