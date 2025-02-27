const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { Cart, CartItem, Product, Order, OrderItem } = require('../models');
const { updateMembershipStatus } = require('../utils/membership');
const router = express.Router();

// Add a product to the cart
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate product exists and is in stock
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found.' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ success: false, error: 'Insufficient stock for this product.' });
        }

        // Find or create a cart for the user
        const [cart] = await Cart.findOrCreate({ where: { userId: req.user.id } });

        // Find or create a cart item
        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            if (cartItem.quantity > product.stock) {
                return res.status(400).json({ success: false, error: 'Insufficient stock to update the cart item.' });
            }
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity
            });
        }

        return res.status(201).json({ success: true, cartItem });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// View the cart
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: { userId: req.user.id },
            include: [
                {
                    model: CartItem,
                    include: [Product],
                },
            ],
        });

        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found.' });
        }

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Remove an item from the cart
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find cart item and verify ownership
        const cartItem = await CartItem.findOne({
            where: { id },
            include: [{ model: Cart, where: { userId: req.user.id } }]
        });

        if (!cartItem) {
            return res.status(404).json({ success: false, error: 'Cart item not found or does not belong to user.' });
        }

        await cartItem.destroy();
        return res.status(200).json({ success: true, message: 'Cart item removed.' });
    } catch (error) {
        console.error('Error removing cart item:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Checkout the cart
router.post('/checkout/now', authenticateToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: { userId: req.user.id },
            include: [CartItem],
        });

        if (!cart || cart.CartItems.length === 0) {
            return res.status(400).json({ success: false, error: 'Cart is empty.' });
        }

        // Create an order
        const order = await Order.create({
            userId: req.user.id,
            status: 'In Progress',
        });

        let unavailableItems = [];
        let processedItems = [];

        for (const cartItem of cart.CartItems) {
            const product = await Product.findByPk(cartItem.productId);
            if (product.stock < cartItem.quantity) {
                unavailableItems.push({
                    productId: cartItem.productId,
                    message: 'Insufficient stock'
                });
                continue; // Skip this item
            }

            await OrderItem.create({
                orderId: order.id,
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                price: product.price,
            });

            product.stock -= cartItem.quantity;
            await product.save();
            processedItems.push(cartItem.productId);
        }

        // Clear processed items from cart
        await CartItem.destroy({
            where: { cartId: cart.id, productId: processedItems }
        });

        // Update membership status after checkout
        await updateMembershipStatus(req.user.id);

        return res.status(200).json({
            success: true,
            order,
            message: 'Checkout complete',
            skippedItems: unavailableItems.length > 0 ? unavailableItems : null
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;