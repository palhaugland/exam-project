const sequelize = require('../models/index').sequelize;
const initializeDatabase = require('../utils/databaseInit');

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

        // Initialize database with roles, memberships, admin user, categories, brands, and products
        console.log('Initializing database...');
        await initializeDatabase();
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
})();