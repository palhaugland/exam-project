const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.error('No Authorization header found.');
        return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'
    console.log('Received Token:', token);

    if (!token) {
        console.error('Token missing from Authorization header.');
        return res.status(401).json({ success: false, error: 'Token missing.' });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
        const user = jwt.verify(token, JWT_SECRET);

        console.log('Decoded Token User:', user);

        req.user = user;

        // Ensure `req.session` exists before setting `role`
        if (!req.session) {
            req.session = {}; // Initialize session if undefined
        }

        // Assign role properly
        req.session.role = user.roleId === 1 ? 'admin' : 'user';
        console.log('Session Role:', req.session.role);

        next();
    } catch (error) {
        console.error('JWT Verification Failed:', error.message);
        return res.status(403).json({ success: false, error: 'Invalid or expired token.' });
    }
};

// Middleware to check for admin role
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.roleId !== 1) {
        console.log('Unauthorized access. User roleId:', req.user ? req.user.roleId : 'undefined');
        return res.status(403).json({ success: false, error: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { authenticateToken, authorizeAdmin };