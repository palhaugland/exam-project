const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Example protected route
router.get('/profile', authenticateToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Access granted.',
        user: req.user, 
    });
});

module.exports = router;