const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const express = require('express');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');
const { Product, Category, Brand, Order, OrderItem, User } = require('../models');
const router = express.Router();

// Users Management
// Fetch all users
router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const users = await User.findAll({attributes: {exclude: ['password']}});
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch users.' });
    }
}
);

// Fetch a specific user
router.get('/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {attributes: {exclude: ['password']}});
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user.' });
    }
}
);

// Create a new user
router.post('/users', authenticateToken, authorizeAdmin, async (req, res) => {
    const { firstname, lastname, username, email, password, address, phone, roleId } = req.body;

    try {
        if (!firstname || !lastname || !username || !email || !password || !address || !phone || !roleId) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }

        // Check if the username or email already exists
        const existingUser = await User.findOne({
            where: { [Op.or]: [{ username }, { email }] },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: `Username "${username}" or Email "${email}" is already taken.`,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            address,
            phone,
            roleId, 
        });

        return res.status(201).json({ success: true, message: 'User created successfully.', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Update a user
router.put('/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.roleId = role;

        await user.save();
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, error: 'Failed to update user.' });
    }
});

// Delete a user
router.delete('/users/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        await user.destroy(); // Permanently delete user

        res.status(200).json({ success: true, message: 'User deleted.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Failed to delete user.' });
    }
});

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
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found.' });
        }

        product.active = false;
        await product.save();
        res.status(200).json({ success: true, message: 'Product deleted.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, error: 'Failed to delete product.' });
    }
});

// Reactivate a product
router.put('/products/:id/reactivate', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found.' });
        }

        product.active = true;
        await product.save();
        res.status(200).json({ success: true, message: 'Product reactivated.' });
    } catch (error) {
        console.error('Error reactivating product:', error);
        res.status(500).json({ success: false, error: 'Failed to reactivate product.' });
    }
});

router.get('/products/', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { search, category, brand } = req.query;
        const whereClause = {};

        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }
        if (category) {
            whereClause.categoryId = category;
        }
        if (brand) {
            whereClause.brandId = brand;
        }

        const products = await Product.findAll({
            where: whereClause,
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Brand, attributes: ['id', 'name'] }
            ]
        });

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

router.get('/brands/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await Brand.findByPk(id);
        if (!brand) {
            return res.status(404).json({ success: false, error: 'Brand not found.' });
        }
        res.status(200).json({ success: true, brand });
    }
    catch (error) {
        console.error('Error fetching brand:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch brand.' });
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
        const brand = await Brand.findByPk(id);
        if (!brand) {
            return res.status(404).json({ success: false, error: 'Brand not found.' });
        }
        await brand.destroy();
        res.status(200).json({ success: true, message: 'Brand deleted.' });
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ success: false, error: 'Failed to delete brand.' });
    }
});

// Orders Management
// Admin: Get all orders
router.get('/orders', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [Product],
                },
            ],
        });

        if (!orders) {
            return res.status(404).json({ success: false, error: 'No orders found.' });
        }

        console.log('Fetched Order Data: ', JSON.stringify(orders, null, 2));

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Get details of a specific order
router.get('/orders/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            where: { id },
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

// Admin: Cancel order
router.put('/orders/:id/cancel', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id, {
            include: [{ model: OrderItem }] 
        });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found.' });
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({ success: false, error: 'Order is already cancelled.' });
        }

        // Restore stock for each product in the order
        for (const item of order.OrderItems) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        // Cancel the order
        order.status = 'Cancelled';
        await order.save();

        return res.status(200).json({ success: true, message: 'Order cancelled, stock restored.', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;