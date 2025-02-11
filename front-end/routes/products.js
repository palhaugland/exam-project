const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.token) return next();
    res.redirect('/auth/login');
}

// List Products
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/admin/products', {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        const data = await response.json();
        console.log("Fetched products:", data);
        res.render('products/list', { products: data.products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('products/list', { products: [] });
    }
});

// Add Product (Form)
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('products/add');
});

// Add Product (POST)
router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
        await fetch('http://localhost:3000/admin/products', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${req.session.token}`
            },
            body: JSON.stringify(req.body),
        });
        res.redirect('/products');
    } catch (error) {
        console.error('Error adding product:', error);
        res.redirect('/products');
    }
});

// Edit Product (Form)
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/products/${req.params.id}`, {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });        
        const data = await response.json();
        res.render('products/edit', { product: data.product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.redirect('/products');
    }
});

// Update Product
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        await fetch(`http://localhost:3000/admin/products/${req.params.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${req.session.token}`
            },
            body: JSON.stringify(req.body),
        });
        res.redirect('/products');
    } catch (error) {
        console.error('Error updating product:', error);
        res.redirect('/products');
    }
});

// Delete Product
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        await fetch(`http://localhost:3000/admin/products/${req.params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        res.redirect('/products');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.redirect('/products');
    }
});

module.exports = router;