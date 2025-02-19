const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

//Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
     if (req.session && req.session.token) return next();
    res.redirect('/auth/login');
    }

//List Categories
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/admin/categories', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        const data = await response.json();
        res.render('categories/list', { categories: data.categories });
    } catch (error) {
        console.error('Error fetching categories', error);
        res.render('categories/list', { categories: [] });
    }
});

// Add Category
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('categories/add');
});

// Add Category POST
router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/admin/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,
            },
            body: JSON.stringify({ name: req.body.name }),
        });

        if (!response.ok) throw new Error('Failed to add category');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error adding category:', error);
        res.redirect('/categories');
    }
});

// Edit Category
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/categories/${req.params.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch category');
        const data = await response.json();
        res.render('categories/edit', { category: data.category });
    } catch (error){
        console.error('Error fetching category', error);
        res.redirect('/categories');
    }
});

// Update Category POST
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/categories/${req.params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            },
            body: JSON.stringify(req.body)
        });
        if (!response.ok) throw new Error('Failed to update category');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error updating category', error);
        res.redirect('/categories');
    }
});

// Delete Category
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/categories/${req.params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            },
        });
        if (!response.ok) throw new Error('Failed to delete category');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error deleting category', error);
        res.redirect('/categories');
    }
});

module.exports = router;