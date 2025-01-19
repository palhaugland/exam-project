// /scripts/sync.js
const sequelize = require('../models/index').sequelize;
const {
    User,
    Role,
    Product,
    Category,
    Brand,
    Membership,
    Cart,
    CartItem,
    Order,
    OrderItem,
} = require('../models/index');

(async () => {
    try {
        // Test database connection
        console.log('Testing database connection...');
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync all models
        console.log('Syncing models to the database...');
        await sequelize.sync({ force: true }); // Use `force: true` only for initial testing/development
        console.log('Models synced successfully.');

        // Populate roles for validation
        console.log('Populating initial roles...');
        await Role.bulkCreate([
            { id: 1, name: 'Admin' },
            { id: 2, name: 'User' },
        ]);
        console.log('Roles added successfully.');

        // Populate membership tiers
        console.log('Populating initial membership tiers...');
        await Membership.bulkCreate([
            { name: 'Bronze', minQuantity: 0, maxQuantity: 14, discount: 0 },
            { name: 'Silver', minQuantity: 15, maxQuantity: 30, discount: 15 },
            { name: 'Gold', minQuantity: 31, maxQuantity: null, discount: 30 },
        ]);
        console.log('Membership tiers added successfully.');

        // Log success message
        console.log('Validation and syncing completed successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
})();