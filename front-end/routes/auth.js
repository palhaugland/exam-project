var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Render login POST request
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log('JWT token:', data.token);
            req.session.token = data.token;
            res.redirect('/dashboard');
        } else {
            res.render('login', { error: data.error || 'Login failed' });
        }
    } catch (error) {
        console.error('Login failed', error);
        res.render ( 'login', { error: 'Login failed. Invalid username or password.' });    
    }
});

// Render logout page
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;