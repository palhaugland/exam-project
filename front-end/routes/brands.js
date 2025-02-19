const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

//Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
     if (req.session && req.session.token) return next();
    res.redirect('/auth/login');
    }

//List Brands
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/admin/brands', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        const data = await response.json();
        res.render('brands/list', { brands: data.brands });
    } catch (error) {
        console.error('Error fetching brands', error);
        res.render('brands/list', { brands: [] });
    }
});

// Add Brand
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('brands/add');
});

// Add Brand POST
router.post('/add', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/admin/brands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`,
            },
            body: JSON.stringify({ name: req.body.name }),
        });

        if (!response.ok) throw new Error('Failed to add brand');
        res.redirect('/brands');
    } catch (error) {
        console.error('Error adding brand:', error);
        res.redirect('/brands');
    }
});

// Edit Brand
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/brands/${req.params.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        const data = await response.json();
        res.render('brands/edit', { brand: data.brand });
    } catch (error) {
        console.error('Error fetching brand:', error);
        res.redirect('/brands');
    }
});

// Edit Brand POST
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/brands/${req.params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            },
            body: JSON.stringify({ name: req.body.name }),
        });
        if (!response.ok) throw new Error('Failed to update brand');
        res.redirect('/brands');
    } catch (error) {
        console.error('Error updating brand:', error);
        res.redirect('/brands');
    }
});

// Delete Brand
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/brands/${req.params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete brand');
        res.redirect('/brands');
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.redirect('/brands');
    }
});

module.exports = router;