const express = require('express');
const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Render login POST request
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password }),
        }); 
        if (!response.ok) throw new Error('Failed to login.');

        const data = await response.json();
        console.log('JWT token:', data.token);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login failed:', error);
        res.status(401).send('Invalid username or password.');

    }    
});