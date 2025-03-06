const express = require('express');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { Order, OrderItem, Product } = require('../models');
const router = express.Router();

// Get all orders for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    include: [Product],
                },
            ],
        });

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Get details of a specific order
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            where: { id, userId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    include: [Product],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found.' });
        }

        return res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;