const bcrypt = require("bcrypt");
const axios = require("axios");
const {
    Role,
    Membership,
    User,
    Product,
    Category,
    Brand,
} = require("../models");

async function initializeDatabase() {
    try {
        console.log("Starting database initialization...");

        // Verify models are available
        if (!Role || !Membership || !User || !Product || !Category || !Brand) {
            throw new Error("One or more models are not available in databaseInit.js");
        }

        // Initialize roles
        if (await Role.count() === 0) {
            await Role.bulkCreate([
                { id: 1, name: "Admin" },
                { id: 2, name: "User" },
            ]);
            console.log("Roles created.");
        }

        // Initialize memberships
        if (await Membership.count() === 0) {
            await Membership.bulkCreate([
                { name: "Bronze", minQuantity: 0, maxQuantity: 14, discount: 0 },
                { name: "Silver", minQuantity: 15, maxQuantity: 30, discount: 15 },
                { name: "Gold", minQuantity: 31, maxQuantity: null, discount: 30 },
            ]);
            console.log("Memberships created.");
        }

        // Initialize admin user
        if (!(await User.findOne({ where: { username: "admin" } }))) {
            const hashedPassword = await bcrypt.hash("P@ssword2023", 10);
            await User.create({
                firstname: "Admin",
                lastname: "Support",
                username: "admin",
                email: "admin@noroff.no",
                password: hashedPassword,
                address: "Online",
                phone: "911",
                roleId: 1,
            });
            console.log("Admin user created.");
        }

        // Fetch products from external API
        let productsData = [];
        try {
            const response = await axios.get("http://backend.restapi.co.za/items/products");
            productsData = Array.isArray(response.data) ? response.data : response.data.data || [];
        } catch (error) {
            console.error("Failed to fetch products:", error.message);
            throw new Error("Failed to fetch products from API");
        }

        if (productsData.length === 0) throw new Error("No products found in API response");

        // Initialize categories and brands
        const categories = [...new Set(productsData.map((item) => item.category))];
        const brands = [...new Set(productsData.map((item) => item.brand))];

        console.log(`🔹 Found ${categories.length} unique categories and ${brands.length} brands.`);

        const categoryMap = {};
        for (const categoryName of categories) {
            const [category] = await Category.findOrCreate({ where: { name: categoryName } });
            categoryMap[categoryName] = category.id;
        }

        const brandMap = {};
        for (const brandName of brands) {
            const [brand] = await Brand.findOrCreate({ where: { name: brandName } });
            brandMap[brandName] = brand.id;
        }

        // Initialize products
        let productCount = 0;
        for (const product of productsData) {
            const categoryId = categoryMap[product.category];
            const brandId = brandMap[product.brand];

            if (!categoryId || !brandId) {
                console.error(`Skipping product '${product.name}': Missing category or brand.`);
                continue;
            }

            const [createdProduct, created] = await Product.findOrCreate({
                where: { name: product.name },
                defaults: {
                    description: product.description || "No description",
                    price: product.price || 0,
                    stock: product.quantity || 0,
                    categoryId,
                    brandId,
                },
            });

            if (created) productCount++;
        }

        console.log(`Database initialization complete. Added ${productCount} new products.`);
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}

module.exports = initializeDatabase;