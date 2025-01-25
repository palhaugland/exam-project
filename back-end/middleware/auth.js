const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
        const user = jwt.verify(token, JWT_SECRET); 
        req.user = user; 
        next(); 
    } catch (error) {
        return res.status(403).json({ success: false, error: 'Invalid or expired token.' });
    }
};

// Middleware to check for admin role
const authorizeAdmin = (req, res, next) => {
    if (req.user.roleId !== 1) { 
        console.log('Unauthorized access. User roleId:', req.user.roleId);
        return res.status(403).json({ success: false, error: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { authenticateToken, authorizeAdmin };