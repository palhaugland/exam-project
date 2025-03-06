const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.token) return next();
    res.redirect('/auth/login');
}

// Get all Orders
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/admin/orders', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,                    
            }
        });

        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();

        res.render('orders/list', { orders: data.orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.render('orders/list', { orders: [] });
    }
});

// Get Order Details
router.get('/view/:id', ensureAuthenticated, async (req, res) => {
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
        console.error('Error fetching order:', error);
        res.redirect('/orders');
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
        res.redirect('/orders');
    }
});

module.exports = router;