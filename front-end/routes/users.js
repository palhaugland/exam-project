const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.token) return next();
    res.redirect('/auth/login');
}

// Create user form
router.get('/create', ensureAuthenticated, async (req, res) => {
  try {
      res.render('users/create', { successMessage: req.session.successMessage, errorMessage: req.session.errorMessage });
      req.session.successMessage = null;
      req.session.errorMessage = null;
  } catch (error) {
      console.error('Error rendering create user page:', error);
      res.redirect('/users');
  }
});

// List all users
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/admin/users', {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching users');
        }

        const data = await response.json();
        console.log("Fetched users:", data);
        res.render('users/list', { users: data.users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('users/list', { users: [] });
    }
});

// View user details
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/users/${req.params.id}`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error fetching user');
        }

        const data = await response.json();
        console.log("Fetched user:", data);
        res.render('users/view', { user: data.user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.render('users/list', { user: {} });
    }
});

// Handle user creation
router.post('/create', ensureAuthenticated, async (req, res) => {
  try {
      const { firstname, lastname, username, email, password, address, phone, roleId } = req.body;

      const response = await fetch(`http://localhost:3000/admin/users`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${req.session.token}`,
          },
          body: JSON.stringify({ firstname, lastname, username, email, password, address, phone, roleId }),
      });

      const data = await response.json(); 
      if (!response.ok) throw new Error(`Failed to create user: ${data.error}`);

      req.session.successMessage = 'User created successfully!';
      res.redirect('/users');
  } catch (error) {
      console.error('Error creating user:', error.message); 
      req.session.errorMessage = error.message; 
      res.redirect('/users/create');
  }
});

// Edit user form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
      const response = await fetch(`http://localhost:3000/admin/users/${req.params.id}`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${req.session.token}`,
          }
      });

      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      
      res.render('users/edit', { user: data.user });
  } catch (error) {
      console.error('Error fetching user:', error);
      res.redirect('/users');
  }
});

// Update user
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
      const { firstname, lastname, email, role } = req.body;

      const response = await fetch(`http://localhost:3000/admin/users/${req.params.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${req.session.token}`,
          },
          body: JSON.stringify({ firstname, lastname, email, role }),
      });

      if (!response.ok) throw new Error('Failed to update user');
      res.redirect('/users');
  } catch (error) {
      console.error('Error updating user:', error);
      res.redirect('/users');
  }
});

// Admin: Delete user
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const response = await fetch(`http://localhost:3000/admin/users/${req.params.id}`, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.session.token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error deleting user');
        }

        res.redirect('/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.redirect('/users');
    }
});



module.exports = router;
