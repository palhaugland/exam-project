
const express = require('express');
const axios = require('axios'); 
const router = express.Router();
const { Role, Membership, User, Product, Category, Brand } = require('../models');

router.post('/', async (req, res) => {
    try {
        console.log('Initializing database...');

        // Create Roles
        await Role.bulkCreate([
            { id: 1, name: 'Admin' },
            { id: 2, name: 'User' },
        ]);
        console.log('Roles created.');

        // Create Memberships
        await Membership.bulkCreate([
            { name: 'Bronze', minQuantity: 0, maxQuantity: 14, discount: 0 },
            { name: 'Silver', minQuantity: 15, maxQuantity: 30, discount: 15 },
            { name: 'Gold', minQuantity: 31, maxQuantity: null, discount: 30 },
        ]);
        console.log('Memberships created.');

        // Create Admin User
        const bcrypt = require('bcrypt'); // Hash password
        const hashedPassword = await bcrypt.hash('P@ssword2023', 10);
        await User.create({
            firstname: 'Admin',
            lastname: 'Support',
            username: 'admin',
            email: 'admin@noroff.no',
            password: hashedPassword,
            address: 'Online',
            phone: '911',
            roleId: 1,
        });
        console.log('Admin user created.');

        // Fetch initial product data from Noroff API
        const response = await axios.get('http://backend.restapi.co.za/items/products');
        const productsData = response.data;

        // Extract unique categories and brands
        const categories = [...new Set(productsData.map((item) => item.category))];
        const brands = [...new Set(productsData.map((item) => item.brand))];

        // Populate Categories and Brands
        const categoryRecords = await Category.bulkCreate(
            categories.map((name) => ({ name })),
            { returning: true }
        );
        const brandRecords = await Brand.bulkCreate(
            brands.map((name) => ({ name })),
            { returning: true }
        );
        console.log('Categories and brands created.');

        // Map categories and brands for association
        const categoryMap = Object.fromEntries(categoryRecords.map((c) => [c.name, c.id]));
        const brandMap = Object.fromEntries(brandRecords.map((b) => [b.name, b.id]));

        // Populate Products
        await Product.bulkCreate(
            productsData.map((item) => ({
                name: item.name,
                description: item.description,
                price: item.price,
                stock: item.stock,
                categoryId: categoryMap[item.category],
                brandId: brandMap[item.brand],
            }))
        );
        console.log('Products created.');

        return res.json({ success: true, message: 'Database initialized successfully.' });
    } catch (error) {
        console.error('Error initializing database:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;