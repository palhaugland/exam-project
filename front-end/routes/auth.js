var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
    console.error("API_BASE_URL is not defined in .env!");
}


router.post('/login', async (req, res) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        console.log("API Response:", data); // Debugging API response

        // Check if data.user exists before accessing roleId
        if (response.ok && data.user && data.user.roleId) {
            req.session.token = data.token;
            req.session.role = data.user.roleId === 1 ? 'admin' : 'user';
            req.session.userId = data.user.id;
            req.session.save(() => {
                res.redirect('/dashboard');
            });
        } else {
            console.error("Login API Response Missing User Data:", data);
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login failed:', error);
        res.render('login', { error: 'Login failed. Try again.' });
    }
});

// Render logout page
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;