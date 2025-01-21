const express = require('express');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { Product, Category, Brand } = require('../models');
const router = express.Router();

// Products Management
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

router.get('/products', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch products.' });
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

router.put('/categories/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await Category.update({ name }, { where: { id } });
        res.status(200).json({ success: true, message: 'Category updated.' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, error: 'Failed to update category.' });
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

router.put('/brands/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await Brand.update({ name }, { where: { id } });
        res.status(200).json({ success: true, message: 'Brand updated.' });
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({ success: false, error: 'Failed to update brand.' });
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

module.exports = router;