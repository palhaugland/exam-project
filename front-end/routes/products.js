const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.token) return next();
    res.redirect('/auth/login');
}

// Fetch and display products, categories, and brands
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const { search, category, brand } = req.query;

        // Fetch products with filters
        const productResponse = await fetch(`http://localhost:3000/admin/products?search=${search || ''}&category=${category || ''}&brand=${brand || ''}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,
            }
        });

        // Fetch categories
        const categoryResponse = await fetch(`http://localhost:3000/admin/categories`, {
            headers: { 'Authorization': `Bearer ${req.session.token}` }
        });

        // Fetch brands
        const brandResponse = await fetch(`http://localhost:3000/admin/brands`, {
            headers: { 'Authorization': `Bearer ${req.session.token}` }
        });

        if (!productResponse.ok || !categoryResponse.ok || !brandResponse.ok) {
            throw new Error('Failed to fetch products, categories, or brands');
        }

        const productData = await productResponse.json();
        const categoryData = await categoryResponse.json();
        const brandData = await brandResponse.json();

        res.render('products/list', {
            products: productData.products || [],
            categories: categoryData.categories || [], 
            brands: brandData.brands || [], // 
            searchQuery: search || '',
            selectedCategory: category || '',
            selectedBrand: brand || ''
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('products/list', {
            products: [],
            categories: [],
            brands: [],
            searchQuery: '',
            selectedCategory: '',
            selectedBrand: '',
        });
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