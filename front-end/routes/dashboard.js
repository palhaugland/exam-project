const express = require('express');
const router = express.Router();

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.token) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
}

// Dashboard Route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log('Dashboard route accessed');
    res.render('dashboard', { username: req.session.username || 'Admin' });
    
});

module.exports = router;