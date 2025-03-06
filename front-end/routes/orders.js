const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.token) return next();
    res.redirect('/auth/login');
}

// List all Orders for the logged-in user
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/orders', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,                    
            }
        });

        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();

        // Ensure role is properly passed
        const isAdmin = req.session.role === 'admin';

        res.render('orders/list', { 
            orders: data.orders,
            isAdmin: isAdmin // Pass isAdmin variable to EJS
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.render('orders/list', { orders: [], isAdmin: false });
    }
});

// Get all orders as Admin
router.get('/admin', ensureAuthenticated, async (req, res) => {
    try {
        console.log('Fetching admin orders with token:', req.session.token);

        const response = await fetch('http://localhost:3000/admin/orders', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,
            }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();

        console.log('Received Admin orders:', data);

        res.render('orders/list', { orders: data.orders, isAdmin: true });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.render('orders/list', { orders: [], isAdmin: true });
    }
});


// Get Order Details - User
router.get('/view/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/orders/${req.params.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,
            }
        });

        if (!response.ok) throw new Error('Failed to fetch order details');
        const data = await response.json();

        console.log("Fetched Order Data:", data);  // Debugging
        res.render('orders/details', { order: data.order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.redirect('/orders/list');
    }
});


// Get Order Details Admin
router.get('/admin/view/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/orders/${req.params.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,
            }
        });

        if (!response.ok) throw new Error('Failed to fetch order details');
        const data = await response.json();

        res.render('orders/details', { order: data.order });
    } catch (error) {
        console.error('Error fetching admin order:', error);
        res.redirect('/orders/admin');
    }
});

// Render cancel confirmation page
router.get('/cancel/:id', ensureAuthenticated, async (req, res) => {
    res.render('orders/cancel', { orderId: req.params.id });
});

// Cancel order
router.post('/cancel/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/orders/${req.params.id}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,
            }
        });
        if (!response.ok) throw new Error('Failed to cancel order');

        const data = await response.json();

        res.render('orders/cancel', { orderNumber: data.order.orderNumber });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.redirect('/orders/admin');
    }
});

module.exports = router;