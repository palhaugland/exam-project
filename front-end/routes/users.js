const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.token) return next();
    res.redirect('/auth/login');
}

// Admin: List all users
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

// Admin: View user details
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
        res.render('users/view', { user: {} });
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

// Admin: Update user details
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
router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
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
