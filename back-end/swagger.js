const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

// Load base definition
const baseDocs = JSON.parse(fs.readFileSync('./swagger/base.json', 'utf8'));
const authDocs = JSON.parse(fs.readFileSync('./swagger/auth.json', 'utf8'));
const orderDocs = JSON.parse(fs.readFileSync('./swagger/order.json', 'utf8'));
const cartDocs = JSON.parse(fs.readFileSync('./swagger/cart.json', 'utf8'));
const adminDocs = JSON.parse(fs.readFileSync('./swagger/admin.json', 'utf8'));

// Merge all Swagger documents
const swaggerDocument = {
    ...baseDocs,
    paths: {
        ...authDocs.paths,
        ...orderDocs.paths,
        ...cartDocs.paths,
        ...adminDocs.paths
    }
};

const swaggerOptions = {
    swaggerOptions: {
        persistAuthorization: true,  
    }
};

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
    console.log('Swagger documentation available at http://localhost:3000/api-docs');
};

module.exports = setupSwagger;