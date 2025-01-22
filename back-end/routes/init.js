const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const router = express.Router();
const { Role, Membership, User, Product, Category, Brand } = require('../models');

router.post('/', async (req, res) => {
    try {
        console.log('Starting database initialization...');

        // Check and create Roles
        const existingRoles = await Role.count();
        if (existingRoles === 0) {
            await Role.bulkCreate([
                { id: 1, name: 'Admin' },
                { id: 2, name: 'User' },
            ]);
            console.log('Roles created.');
        } else {
            console.log('Roles already exist. Skipping role creation.');
        }

        // Check and create Memberships
        const existingMemberships = await Membership.count();
        if (existingMemberships === 0) {
            await Membership.bulkCreate([
                { name: 'Bronze', minQuantity: 0, maxQuantity: 14, discount: 0 },
                { name: 'Silver', minQuantity: 15, maxQuantity: 30, discount: 15 },
                { name: 'Gold', minQuantity: 31, maxQuantity: null, discount: 30 },
            ]);
            console.log('Memberships created.');
        } else {
            console.log('Memberships already exist. Skipping membership creation.');
        }

        // Check and create Admin User
        const existingAdmin = await User.findOne({ where: { username: 'admin' } });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('P@ssword2023', 10);
            await User.create({
                firstname: 'Admin',
                lastname: 'Support',
                username: 'admin',
                email: 'admin@noroff.no',
                password: hashedPassword,
                address: 'Online',
                phone: '911',
                roleId: 1, // Admin Role ID
            });
            console.log('Admin user created.');
        } else {
            console.log('Admin user already exists. Skipping admin user creation.');
        }

        // Fetch initial data from Noroff API
        const response = await axios.get('http://backend.restapi.co.za/items/products');
        console.log('API Response:', response.data); // Debug the response

        // Ensure the data is an array
        const productsData = Array.isArray(response.data) ? response.data : response.data.data || [];

        // Extract unique categories and brands
        const categories = [...new Set(productsData.map((item) => item.category))];
        const brands = [...new Set(productsData.map((item) => item.brand))];

        // Populate Categories
        for (const categoryName of categories) {
            const [category] = await Category.findOrCreate({ where: { name: categoryName } });
            console.log(`Category: ${category.name} added.`);
        }

        // Populate Brands
        for (const brandName of brands) {
            const [brand] = await Brand.findOrCreate({ where: { name: brandName } });
            console.log(`Brand: ${brand.name} added.`);
        }

        // Populate Products
        for (const product of productsData) {
            const category = await Category.findOne({ where: { name: product.category } });
            const brand = await Brand.findOne({ where: { name: product.brand } });

            if (!category || !brand) {
                console.error(`Skipping product: ${product.name} due to missing category or brand.`);
                continue;
            }

            const [createdProduct, created] = await Product.findOrCreate({
                where: { name: product.name },
                defaults: {
                    description: product.description,
                    price: product.price,
                    stock: product.quantity,
                    categoryId: category.id,
                    brandId: brand.id,
                },
            });

            if (created) {
                console.log(`Product: ${createdProduct.name} added.`);
            } else {
                console.log(`Product: ${createdProduct.name} already exists.`);
            }
        }
        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Error initializing database:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;