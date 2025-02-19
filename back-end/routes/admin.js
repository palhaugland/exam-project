const express = require('express');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { Product, Category, Brand, Order } = require('../models');
const router = express.Router();

// Products 
router.post('/products', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { name, description, price, stock, categoryId, brandId } = req.body;
        const newProduct = await Product.create({ name, description, price, stock, categoryId, brandId });
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, error: 'Failed to create product.' });
    }
});

router.put('/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, categoryId, brandId } = req.body;
        const updatedProduct = await Product.update(
            { name, description, price, stock, categoryId, brandId },
            { where: { id } }
        );
        res.status(200).json({ success: true, message: 'Product updated.', updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, error: 'Failed to update product.' });
    }
});

router.delete('/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Product.destroy({ where: { id } });
        res.status(200).json({ success: true, message: 'Product deleted.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, error: 'Failed to delete product.' });
    }
});

router.get('/products/', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch products.' });
    }
});

router.get('/products/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found.' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch product.' });
    }
});

// Categories Management
router.post('/categories', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, error: 'Failed to create category.' });
    }
});

router.get("/categories", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, error: "Failed to fetch categories." });
    }
});

router.get('/categories/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found.' });
        }
        res.status(200).json({ success: true, category });
    }
    catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch category.' });
    }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    category.name = req.body.name;
    await category.save();
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/categories/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Category.destroy({ where: { id } });
        res.status(200).json({ success: true, message: 'Category deleted.' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, error: 'Failed to delete category.' });
    }
});

// Brands Management
router.post('/brands', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const newBrand = await Brand.create({ name });
        res.status(201).json({ success: true, brand: newBrand });
    } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ success: false, error: 'Failed to create brand.' });
    }
});

router.get("/brands", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.status(200).json({ success: true, brands });
    } catch (error) {
        console.error("Error fetching brands:", error);
        res.status(500).json({ success: false, error: "Failed to fetch brands." });
    }
});

router.put('/brands/:id', async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    brand.name = req.body.name;
    await brand.save();
    res.status(200).json({ success: true, brand });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/brands/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Brand.destroy({ where: { id } });
        res.status(200).json({ success: true, message: 'Brand deleted.' });
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ success: false, error: 'Failed to delete brand.' });
    }
});

// Admin: Update order status
router.put('/orders/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['In Progress', 'Ordered', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status provided.' });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found.' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ success: true, message: 'Order status updated.', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;